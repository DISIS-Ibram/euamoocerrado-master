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
        fields = '__all__'

    def is_valid(self, raise_exception=False):
        if 'password_new' in self.initial_data:
            self.initial_data['password'] = self.initial_data['password_new']
        if 'email' in self.initial_data:
            self.initial_data["username"] = self.initial_data["email"]
        if 'is_superuser' in self.initial_data:
            self.initial_data['is_staff'] = self.initial_data['is_superuser']
        return super(serializers.ModelSerializer, self).is_valid(raise_exception)

    def create(self, validated_data):
        # send_email("Boas Vindas", mensagem_boas_vindas,
        #            validated_data["email"])
        validated_data["username"] = validated_data["email"]
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        try:
            group = Group.objects.get(id=2)
            user.groups.add(group)
        except:
            print('Erro na criação do usuário')
        return user

    def update(self, instance, validated_data):
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name']
        if 'email' in validated_data:
            instance.email = validated_data['email']
            instance.username = validated_data['email']
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        if 'is_superuser' in validated_data:
            instance.is_superuser = validated_data['is_superuser']
        instance.save()
        return instance


@csrf_exempt
@api_view(['POST'])
@permission_classes((AllowAny,))
def create_user(request):
    serialized = UserSerializer(data=request.data)
    if serialized.is_valid():
        serialized.save()
        return Response(serialized.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


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
