from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import os
from curupira_rest_api.utils import send_email
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers, serializers, viewsets
from django.contrib.auth.models import Group


script_dir = os.path.dirname(__file__)  # <-- absolute dir the script is in
rel_path = "mensagem_boas_vindas.html"
abs_file_path = os.path.join(script_dir, rel_path)
mensagem_boas_vindas = open(abs_file_path).read()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'password',
            'first_name',
            'last_name',
        )

    def is_valid(self, raise_exception=False):
        if 'email' in self.initial_data:
            self.initial_data['username'] = self.initial_data['email']
        return super(UserSerializer, self).is_valid(raise_exception=raise_exception)

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['username'] = validated_data['email']

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        group = Group.objects.filter(id=2).first()
        if group:
            user.groups.add(group)

        return user

    def update(self, instance, validated_data):
        validated_data.pop('is_superuser', None)
        validated_data.pop('is_staff', None)
        validated_data.pop('groups', None)

        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))

        return super(UserSerializer, self).update(instance, validated_data)



# ######################################################
@api_view(['POST'])
@permission_classes((AllowAny,))
def create_user(request):
    print("REQUEST DATA:", request.data)

    serialized = UserSerializer(data=request.data)

    if serialized.is_valid():
        user = serialized.save()
        print("USER CREATED:", user.id)
        return Response(serialized.data, status=status.HTTP_201_CREATED)
    else:
        print("SERIALIZER ERRORS:", serialized.errors)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

# @csrf_exempt
# @api_view(['POST'])
# @permission_classes((AllowAny,))
# def create_user(request):
#     serialized = UserSerializer(data=request.data)
#     if serialized.is_valid():
#         serialized.save()
#         return Response(serialized.data, status=status.HTTP_201_CREATED)
#     else:
#         return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)
# ######################################################


# # Serializers define the API representation.
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         #exclude = ['password']
#         fields = '__all__'
# # ViewSets define the view behavior.


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
