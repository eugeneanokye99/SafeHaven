from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .model.predict import generate_response

@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_message = data.get('message', '')
            if user_message:
                response_message = generate_response(user_message)
                return JsonResponse({'response': response_message})
            else:
                return JsonResponse({'error': 'Invalid message format'}, status=400)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
