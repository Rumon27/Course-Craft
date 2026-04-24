from ast import Return
from turtle import title
from rest_framework import status
from users.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from courses.models import Course, Enrollment

class AssignmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_pk):
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
        if request.user.role == 'student':
            enrolled = Enrollment.objects.filter(student=request.user, course=course, status='approved').exists()
            if not enrolled:
                return Response({'error': 'You are not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'teacher' and course.teacher != request.user:
            return Response({'error': 'You do not teach this course.'}, status=status.HTTP_403_FORBIDDEN)
        assignments = Assignment.objects.filter(course=course)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request, course_pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can create assignments.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
        if course.teacher != request.user:
            return Response({'error': 'You can only create assignments for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_pk, pk):
        try:
            assignment = Assignment.objects.get(pk=pk, course__pk=course_pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)

    def put(self, request, course_pk, pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can update assignments.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            assignment = Assignment.objects.get(pk=pk, course__pk=course_pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        if assignment.course.teacher != request.user:
            return Response({'error': 'You can only update assignments for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, course_pk, pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can delete assignments.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            assignment = Assignment.objects.get(pk=pk, course__pk=course_pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        if assignment.course.teacher != request.user:
            return Response({'error': 'You can only delete assignments for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        assignment.delete()
        return Response({'message': 'Assignment deleted.'}, status=status.HTTP_204_NO_CONTENT)


class SubmissionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_pk, pk):
        try:
            assignment = Assignment.objects.get(pk=pk, course__pk=course_pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        if request.user.role == 'teacher':
            if assignment.course.teacher != request.user:
                return Response({'error': 'You do not teach this course.'}, status=status.HTTP_403_FORBIDDEN)
            submissions = Submission.objects.filter(assignment=assignment)
        elif request.user.role == 'student':
            submissions = Submission.objects.filter(assignment=assignment, student=request.user)
        else:
            submissions = Submission.objects.filter(assignment=assignment)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    def post(self, request, course_pk, pk):
        if request.user.role != 'student':
            return Response({'error': 'Only students can submit assignments.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            assignment = Assignment.objects.get(pk=pk, course__pk=course_pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        enrolled = Enrollment.objects.filter(student=request.user, course=assignment.course, status='approved').exists()
        if not enrolled:
            return Response({'error': 'You are not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student=request.user, assignment=assignment, status='submitted')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GradeSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, course_pk, pk, submission_pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can grade submissions.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            submission = Submission.objects.get(pk=submission_pk, assignment__pk=pk, assignment__course__pk=course_pk)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found.'}, status=status.HTTP_404_NOT_FOUND)
        if submission.assignment.course.teacher != request.user:
            return Response({'error': 'You can only grade submissions for your own courses.'}, status=status.HTTP_403_FORBIDDEN)

        mark = request.data.get('mark_obtained')
        if mark is None:
            return Response({'error': 'mark_obtained is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            mark = int(mark)
        except (ValueError, TypeError):
            return Response({'error': 'mark_obtained must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)

        if mark > submission.assignment.total_marks:
            return Response({'error': f'Mark cannot exceed total marks ({submission.assignment.total_marks}).'}, status=status.HTTP_400_BAD_REQUEST)
        submission.mark_obtained = mark
        submission.status = 'graded'
        submission.save()
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data)
    
    
class StudentPerformanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id=None):
        if request.user.role == 'student':
            target_student = request.user
        elif request.user.role in ['teacher', 'admin']:
            if student_id is None:
                return Response({'error':'Please Provide a student Id'}, status=status.HTTP_404_NOT_FOUND)
            
            try:
                target_student = User.objects.get(pk = student_id, role='student')
            except User.DoesNotExist:
                return Response({'error':'Student not found'}, status=status.HTTP_403_FORBIDDEN)
            
        else:
            return Response({'error':'No permuission'}, status=status.HTTP_403_FORBIDDEN)
        
        enrollments = Enrollment.objects.filter(student = target_student, status='approved')
        performance = []

        for enrollment in enrollments:
            course = enrollment.course
            assignments = Assignment.objects.filter(course=course)
            assignment_data = []
            total_marks = 0
            obtained_marks = 0
            
            for assignment in assignments:
                submission = Submission.objects.filter(assignment=assignment, student=target_student).first()
                assignment_data.append({
                    'assignment_id': assignment.id,
                    'assignment_title': assignment.title,
                    'total_marks': assignment.total_marks,
                    'mark_obtained': submission.mark_obtained if submission else None,
                    'status': submission.status if submission else 'not submitted',
                })
                
                total_marks += assignment.total_marks
                
                if submission and submission.mark_obtained is not None:
                    obtained_marks += submission.mark_obtained

                
            performance.append({
                'course_id': course.id,
                'course_name': course.name,
                'is_completed': course.is_completed,
                'total_marks': total_marks,
                'obtained_marks': obtained_marks,
                'percentage': round((obtained_marks / total_marks) * 100, 2) if total_marks > 0 else 0,
                'assignments': assignment_data,
            })
            
        return Response({
            'student': target_student.username,
            'performance':performance
        })
                
                
                    
        