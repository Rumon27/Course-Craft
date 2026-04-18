from rest_framework import serializers
from .models import Material

class MaterialSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Material
        fields = ['id', 'course', 'course_name', 'uploaded_by', 'uploaded_by_name', 'title', 'description', 'material_type', 'file', 'link', 'uploaded_at', 'updated_at']
        read_only_fields = ['uploaded_by', 'course', 'uploaded_at', 'updated_at']

    def validate(self, data):
        material_type = data.get('material_type')
        if material_type == 'file' and not data.get('file'):
            raise serializers.ValidationError("You must provide a file for file type materials.")
        if material_type == 'link' and not data.get('link'):
            raise serializers.ValidationError("You must provide a link for link type materials.")
        return data