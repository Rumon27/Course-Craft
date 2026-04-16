from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer

from users.models import User
# Create your views here.


     #only admin can post && all can see
class CourseListCreateView(APIView):
     permission_classes = [IsAuthenticated]

     def get(self, request):
          courses = Course.objects.filter(is_active = True)
          serializer = CourseSerializer(courses, many = True)

          return Response(serializer.data)

     def post(self, request): 
          if request.user.role != 'admin':
               return Response({'error': 'Only admins can create courses'}, status= status.HTTP_403_FORBIDDEN)

          serializer = CourseSerializer(data = request.data)

          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_201_CREATED)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
class CourseDetailView(APIView):
     permission_classes = [IsAuthenticated]

     def get(self, request, pk):
          try:
               course = Course.objects.get(pk = pk)
          except Course.DoesNotExist:
               return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

          serializer = CourseSerializer(course)
          return Response(serializer.data)
     
     def put(self, request, pk):
          if request.user.role != 'admin':
               return Response({'error': 'Only admins can update courses'}, status=status.HTTP_403_FORBIDDEN)

          try:
               course = Course.objects.get(pk = pk)
          except Course.DoesNotExist:
               return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
          
          serializer = CourseSerializer(course, data = request.data)

          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data)

          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
     def delete(self, request, pk):
          if request.user.role != 'admin':
               return Response({'error': 'Only admins can deactivate courses'}, status=status.HTTP_403_FORBIDDEN)

          try:
               course = Course.objects.get(pk=pk)
          except Course.DoesNotExist:
               return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
          
          course.is_active = False
          
          course.save()
          
          return Response({'message': 'Course deactivated.'})
     
               

class EnrollmentView(APIView):
     permission_classes = [IsAuthenticated]

     def post(self, request):
          if request.user.role != 'student':
               return Response({'error': 'Only students can enroll.'}, status=status.HTTP_403_FORBIDDEN)
          
          course_id = request.data.get('course')
          
          try:
               course = Course.objects.get(pk = course_id, is_active = True)
          except Course.DoesNotExist:
               return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
          
          #prerequisite
          prerequisites = course.prerequisites.all()

          for prereq in prerequisites:
               enrollment = Enrollment.objects.filter(student = request.user, course = prereq,
                                                      status = 'approved').first()
               
               if not enrollment:
                    return Response({'error': f'You must complete {prereq.name} first'}, status=status.HTTP_400_BAD_REQUEST)
               
          enrollment, created = Enrollment.objects.get_or_create(student = request.user, course = course)
          
          if not created:
               return Response({'error': 'You have already applied in this course'}, status=status.HTTP_400_BAD_REQUEST)     

          serializer = EnrollmentSerializer(enrollment)
          return Response(serializer.data, status=status.HTTP_201_CREATED)


class EnrollmentManageView(APIView):
     permission_classes = [IsAuthenticated]

     def get(self, request):
          if request.user.role == 'admin':
               enrollments = Enrollment.objects.all()
          elif request.user.role == 'teacher':
               enrollments = Enrollment.objects.filter(course__teacher = request.user) # __ is like ENrollment-> course(Course) -> user(teacher)
          else:
               enrollments = Enrollment.objects.filter(student=request.user)
               
          serializer = EnrollmentSerializer(enrollments, many = True)     
          return Response(serializer.data, status=status.HTTP_200_OK)

     def put(self, request, pk):
          if request.user.role != 'admin':
               return Response({'error': 'Only admins can approve or reject enrollments'}, status=status.HTTP_403_FORBIDDEN)

          try:
               enrollment = Enrollment.objects.get(pk=pk)
          except Enrollment.DoesNotExist:
               return Response({'error': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
          
          new_status = request.data.get('status')
          
          if new_status not in ['approved', 'rejected']:
               return Response({'error': 'Invalid'}, status=status.HTTP_400_BAD_REQUEST)
          
          enrollment.status = new_status
          enrollment.save()

          serializer = EnrollmentSerializer(enrollment)
          return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


          
          