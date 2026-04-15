from django.core import validators
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
     password = serializers.CharField(write_only=True, validators = [validate_password])

     class Meta:
          model = User
          fields = ['username', 'email', 'password', 'role']

     def validate_role(self, value):
          if value == 'teacher':
               raise serializers.ValidationError("Teachers cannot register directly. Please contact an admin to create an account.")
          return value

     def create(self, validated_data):
          user = User.objects.create_user(
               username = validated_data['username'],
               email = validated_data['email'],
               password = validated_data['password'],
               role = validated_data['role']
          )
          return user
     
class TeacherCreateSerializer(serializers.ModelSerializer):
     password = serializers.CharField(write_only=True)
     
     class Meta:
          model = User
          fields = ['username', 'email', 'password']

     def create(self, validated_data):
          user = User.objects.create_user(
               username = validated_data['username'],
               email = validated_data['email'],
               password = validated_data['password'],
               role = 'teacher'
          )
          return user
     
class UserSerializer(serializers.ModelSerializer):
     class Meta:
          model = User
          fields = ['id', 'username', 'email', 'role']
          
          
          