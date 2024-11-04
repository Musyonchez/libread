import boto3

polly = boto3.client('polly')
response = polly.synthesize_speech(
    Text='Hello world!',
    VoiceId='Joanna',
    OutputFormat='mp3'
)
