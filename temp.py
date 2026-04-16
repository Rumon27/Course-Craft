from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from courses.models import Course, Enrollment

class AssignmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'teacher':
            assignments = Assignment.objects.filter(course__teacher=request.user)
        elif request.user.role == 'student':
            enrolled_courses = Enrollment.objects.filter(student=request.user, status='approved').values_list('course', flat=True)
            assignments = Assignment.objects.filter(course__in=enrolled_courses)
        else:
            assignments = Assignment.objects.all()
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can create assignments.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.validated_data['course']
            if course.teacher != request.user:
                return Response({'error': 'You can only create assignments for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            assignment = Assignment.objects.get(pk=pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can update assignments.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            assignment = Assignment.objects.get(pk=pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        if assignment.course.teacher != request.user:
            return Response({'error': 'You can only update assignments for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AssignmentSerializer(assignment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can delete assignments.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            assignment = Assignment.objects.get(pk=pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        if assignment.course.teacher != request.user:
            return Response({'error': 'You can only delete assignments for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        assignment.delete()
        return Response({'message': 'Assignment deleted.'})


class SubmissionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'teacher':
            submissions = Submission.objects.filter(assignment__course__teacher=request.user)
        elif request.user.role == 'student':
            submissions = Submission.objects.filter(student=request.user)
        else:
            submissions = Submission.objects.all()
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can submit assignments.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            assignment = serializer.validated_data['assignment']
            enrolled = Enrollment.objects.filter(student=request.user, course=assignment.course, status='approved').exists()
            if not enrolled:
                return Response({'error': 'You are not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)
            serializer.save(student=request.user, status='submitted')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GradeSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can grade submissions.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            submission = Submission.objects.get(pk=pk)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found.'}, status=status.HTTP_404_NOT_FOUND)
        if submission.assignment.course.teacher != request.user:
            return Response({'error': 'You can only grade submissions for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        mark = request.data.get('mark_obtained')
        if mark is None:
            return Response({'error': 'mark_obtained is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if int(mark) > submission.assignment.total_marks:
            return Response({'error': f'Mark cannot exceed total marks ({submission.assignment.total_marks}).'}, status=status.HTTP_400_BAD_REQUEST)
        submission.mark_obtained = mark
        submission.status = 'graded'
        submission.save()
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data)