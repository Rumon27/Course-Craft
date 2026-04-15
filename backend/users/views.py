from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, TeacherCreateSerializer, UserSerializer

class RegisterView(APIView):
     def post(self, request):
          serializer = RegisterSerializer(data=request.data)
          if serializer.is_valid():
               user = serializer.save()
               return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
class LoginView(APIView):
     def post(self, request):
          username = request.data.get('username')
          password = request.data.get('password')
          user = authenticate(username = username, password = password)

          if user: 
               refresh = RefreshToken.for_user(user)
               return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
               })
          
          return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
          
class CreateTeacherView(APIView):
     permission_classes = [IsAuthenticated]

     def post(self, request):
          if request.user.role != 'admin':
               return Response({'error': 'Only admins can create teachers. '}, status=status.HTTP_403_FORBIDDEN)
          
          serializer = TeacherCreateSerializer(data = request.data)

          if serializer.is_valid():
               user = serializer.save()
               return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


     
