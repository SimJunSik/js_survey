from .base import *
secrets = json.load(open(SECRET_DIR / 'secrets.json', 'rb'))

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': secrets['AWS_RDS_NAME'],
        'USER': secrets['AWS_RDS_USER'],
        'PASSWORD': secrets['AWS_RDS_PASSWORD'],
        'HOST': secrets['AWS_RDS_HOST'],
        'PORT': secrets['AWS_RDS_PORT'],
    }
}
