from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Material
from .serializers import MaterialSerializer
from courses.models import Course, Enrollment

class MaterialListCreateView(APIView):
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
        materials = Material.objects.filter(course=course)
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)

    def post(self, request, course_pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can add materials.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
        if course.teacher != request.user:
            return Response({'error': 'You can only add materials to your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = MaterialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course, uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MaterialDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_pk, pk):
        try:
            material = Material.objects.get(pk=pk, course__pk=course_pk)
        except Material.DoesNotExist:
            return Response({'error': 'Material not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MaterialSerializer(material)
        return Response(serializer.data)

    def put(self, request, course_pk, pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can update materials.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            material = Material.objects.get(pk=pk, course__pk=course_pk)
        except Material.DoesNotExist:
            return Response({'error': 'Material not found.'}, status=status.HTTP_404_NOT_FOUND)
        if material.course.teacher != request.user:
            return Response({'error': 'You can only update materials for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = MaterialSerializer(material, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, course_pk, pk):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can delete materials.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            material = Material.objects.get(pk=pk, course__pk=course_pk)
        except Material.DoesNotExist:
            return Response({'error': 'Material not found.'}, status=status.HTTP_404_NOT_FOUND)
        if material.course.teacher != request.user:
            return Response({'error': 'You can only delete materials for your own courses.'}, status=status.HTTP_403_FORBIDDEN)
        material.delete()
        return Response({'message': 'Material deleted.'}, status=status.HTTP_204_NO_CONTENT)