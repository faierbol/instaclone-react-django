from . import serializers
from types import *

def custom_jwt_response_handler(token, user=None, request=None):
    return {
        'token' : token,
        'user' : userSerializer(user, context={'request' : request}).data
    }
class Utils:
	def listify(arg):
		if Utils.is_sequence(arg) and not isinstance(arg, dict):
			return arg
		return [arg,]

	def is_sequence(arg):
		if isinstance(arg, str):
			return False
		if hasattr(arg, "__iter__"):
			return True
