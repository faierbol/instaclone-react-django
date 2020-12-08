from rest_framework import serializers
from datetime import datetime
from django.contrib.auth.models import User
from .models import Post, Comment

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name')

class postSerializer(serializers.ModelSerializer):
    likers_details = userSerializer(many=True, read_only=True, source='likes')
    date_created = serializers.SerializerMethodField()

    def get_date_created(self, obj):
        day = obj.date_created.strftime("%d")
        date = obj.date_created.strftime("%b ")
        time = datetime.now()

        """if time.minute - date.minute < 0:
            return str(time.hour - date.hour) + "h"
        else:
            if time.hour - date.hour >= 24:
                return str(time.month - date.month) + "d"
            else:
                if time.month - date.month == 7:
                    return date.strftime("%b %d")"""

        return (date + day.strip("0"))
    class Meta:
        model = Post
        fields = '__all__'

class commentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = '__all__'

class UserSerializerWithToken(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField()

    def get_token(self, object):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(object)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    class Meta:
        model = User
        fields = ('token', 'username', 'email', 'password')