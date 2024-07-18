import numpy as np
from tensorflow.keras.models import load_model
from .preprocess import preprocess_input, tokenizer

# Load the model
model = load_model('/home/eugene-anokye/Desktop/SafeHaven/backend/python-backend/chatbot_model.keras')

def generate_response(input_text):
    input_sequence = preprocess_input(input_text)
    max_sequence_length = input_sequence.shape[1]

    # Create a zero-filled tensor for the decoder
    decoder_input = np.zeros((1, max_sequence_length))

    # Predict the response
    prediction = model.predict([input_sequence, decoder_input])

    # Choose the best response from prediction
    response_sequence = np.argmax(prediction[0], axis=-1)

    # Convert sequence to text
    response_text = ' '.join(tokenizer.index_word.get(idx, '') for idx in response_sequence if idx > 0)

    # Optional post-processing
    response_text = postprocess_response(response_text)

    return response_text

def postprocess_response(response_text):
    # Example: Remove consecutive duplicate words
    words = response_text.split()
    cleaned_words = [words[0]]

    for word in words[1:]:
        if word != cleaned_words[-1]:
            cleaned_words.append(word)

    return ' '.join(cleaned_words)
