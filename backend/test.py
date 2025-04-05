import google.generativeai as genai

genai.configure(api_key="AIzaSyAgC_AcKjZRK7OjgScftkYDbHwbxVPHO4w")

models = genai.list_models()
print([model.name for model in models])
