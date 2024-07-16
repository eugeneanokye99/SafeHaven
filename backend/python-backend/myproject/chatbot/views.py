import os
import json
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json

# Set up logging
logging.basicConfig(level=logging.DEBUG)

class ChatbotView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        model_path = 'C:/Users/Eugene/Desktop/SafeHaven/backend/python-backend/chatbot_model.keras'
        self.model = tf.keras.models.load_model(model_path)
        
        # Load the tokenizer
        tokenizer_path = 'C:/Users/Eugene/Desktop/SafeHaven/backend/python-backend/tokenizer.json'
        self.tokenizer = self.load_tokenizer(tokenizer_path)

    def load_tokenizer(self, path):
        with open(path, 'r') as f:
            data = json.load(f)
            tokenizer = tokenizer_from_json(data)
        return tokenizer

    def preprocess_input(self, input_text):
        # Convert text to sequences using the loaded tokenizer
        sequences = self.tokenizer.texts_to_sequences([input_text])
        
        # Pad sequences to the maximum length used during training
        maxlen = 100  # Adjust to the maxlen used during training
        padded_sequences = pad_sequences(sequences, maxlen=maxlen, padding='post')
        
        return np.array(padded_sequences)

    def postprocess_response(self, prediction):
        # Get the index of the highest probability for each timestep
        predicted_indices = np.argmax(prediction, axis=-1)
        logging.debug(f"Predicted indices: {predicted_indices}")
        
        # Convert indices to words
        response_words = []
        for index in predicted_indices[0]:
            if index != 0:  # 0 is usually the padding token
                word = self.tokenizer.index_word.get(index, '')
                response_words.append(word)
                logging.debug(f"Index: {index}, Word: {word}")
        
        response_text = ' '.join(response_words).strip()
        logging.debug(f"Response words: {response_words}")
        return response_text

    def post(self, request):
        input_text = request.data.get('message')
        logging.debug(f"Received input text: {input_text}")
        preprocessed_input = self.preprocess_input(input_text)
        logging.debug(f"Preprocessed input: {preprocessed_input}")
        
        # Make prediction
        prediction = self.model.predict(preprocessed_input)
        logging.debug(f"Model prediction: {prediction}")
        response = self.postprocess_response(prediction)
        logging.debug(f"Post-processed response: {response}")
        
        return Response({'reply': response}, status=status.HTTP_200_OK)

