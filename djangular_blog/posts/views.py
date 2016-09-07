from rest_framework import generics
from posts.models import Post
from posts.serializers import PostSerializer 
# Create your views here.

class PostList(generics.ListCreateAPIView):
    """
    List all boards, or create a new board
    """
    model = Post
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    
class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a board instance.
    """
    model = Post
    serializer_class = PostSerializer
