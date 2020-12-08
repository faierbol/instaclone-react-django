from django.shortcuts import render
from .models import Post, Comment
from django.contrib.auth.models import User
from .serializers import postSerializer, commentSerializer, UserSerializerWithToken, userSerializer
from rest_framework import serializers, status, permissions
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

class userCreate(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self,request):
        user = request.data.get('user')
        if not user:
            return Response({'response' : 'error', 'message' : 'No data found'})

        serializer = UserSerializerWithToken(data=user)
        if serializer.is_valid():
            saved_user = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})
        return Response({"response" : "success", "message" : "user created succesfully"})

@api_view(['GET'])
@permission_classes([AllowAny])
def currentUser(request):
    serializer = userSerializer(request.user)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def postList(request):

	posts = Post.objects.all()
	serializer = postSerializer(posts, many=True)
	return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def postDetail(request, pk):
	post = Post.objects.get(id=pk)
	serializer = postSerializer(post, many=False)

	return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postCreate(request):
	parser_classes = (MultiPartParser, FormParser)
	serializer = postSerializer(data=request.data)

	if serializer.is_valid():
		serializer.save()

		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def postUpdate(request, pk):
	post = Post.objects.get(id=pk)
	serializer = postSerializer(instance=post, data=request.data, partial=True)

	if serializer.is_valid():
		serializer.save()

		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def postDelete(request, pk):
	post = Post.objects.get(id=pk)
	post.delete()

	return Response("POST DELETED!")

@api_view(['GET'])
@permission_classes([AllowAny])
def comments(request):
	comment = Comment.objects.all()
	serializer = commentSerializer(comment, many=True)

	return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def commentCreate(request):
	serializer = commentSerializer(data=request.data)

	if serializer.is_valid():
		serializer.save()

		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def commentDelete(request, pk):
	comment = Comment.objects.get(id=pk)
	comment.delete()

	return Response("COMMENT DELETED!")