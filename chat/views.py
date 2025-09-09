from django.shortcuts import render, redirect
from .models  import  *
def createroom(request):
    if request.method == 'POST':
        username = request.POST['username']
        roomname = request.POST['roomname']
        try:
            get_room = Room.objects.get(room_name=roomname)
            
        except Room.DoesNotExist:
            new_room = Room.objects.create(room_name=roomname)
            new_room.save()
            
        return redirect('room', room_name=roomname, username=username)
            
    return render(request, 'chat/chat.html')

def messageview(request, username, room_name):
    get_room = Room.objects.get(room_name=room_name)
    get_messages = Message.objects.filter(room=get_room)
    context = {
        'username': username,
        'room_name': room_name,
        'messages': get_messages,
    }
    return render(request, 'chat/message.html', context)