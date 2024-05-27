#!/usr/bin/env python3

from bs4 import BeautifulSoup
import requests
import re
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn_crfsuite import CRFClassifier
from sklearn.model_selection import train_test_split

def fetch_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    content_div = soup.find("div", class_="chapter-content")
    return content_div.get_text() if content_div else "Content not found"

def preprocess(text):
    cleaned_text = re.sub(r'[^\w\s]', '', text.lower())
    return word_tokenize(cleaned_text)

# Example usage
url = "http://example.com/chapter-url"
content = fetch_content(url)
tokens = preprocess(content)

# Placeholder for a labeled dataset - you need to replace this with actual data
# Each item in the dataset should be a tuple of (sentence, [(word, label)])
# For example: ("The cat sat on the mat.", [('The', 'O'), ('cat', 'B-PER'),...])

# Assuming you have a function to prepare your labeled dataset
# X, y = prepare_labeled_dataset()

# vectorizer = TfidfVectorizer(tokenizer=preprocess)
# X = vectorizer.fit_transform(tokens)
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# crf = CRFClassifier(verbose=True)
# crf.fit(X_train, y_train)

# accuracy = crf.score(X_test, y_test)
# print(f"Accuracy: {accuracy}")

# To apply the model to a new chapter
# new_chapter_text = "Some new chapter text here."
# new_chapter_tokens = preprocess(new_chapter_text)
# predicted_entities = crf.predict(new_chapter_tokens)
# print(predicted_entities)
