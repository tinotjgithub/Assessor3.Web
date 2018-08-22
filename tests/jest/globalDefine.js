/*eslint-env node, mocha */
global.define = () => {
    config = {   
        "logger": {
            "LOGGING_ENABLED": true,
            "LOGGER_TYPE": "$$LOGGER_TYPE$$",
            "MAXIMUM_LOGS_FOR_BATCHSAVE": 1
        },
        "applicationinsightconfig": {
            "INSTRUMENTATION_KEY": "$$INSTRUMENTATION_KEY$$",
            "APPLICATION_VERSION": "$$APPLICATION_VERSION$$",
            "ROLE_NAME": "Assessor 3 Web"
        },
        "general": {
            "SERVICE_BASE_URL": "$$$",
            "DISPLAY_SCRIPT_INFO": false,
            "AUDIT_LOG_LIMIT": 20,
            "STORAGE_ADAPTER_CACHE_TIME_IN_MINUTES": 60,
            "RETRY_ATTEMPT_COUNT": 3,
            "DATA_SERVICE_CALL_TIME_OUT": 84000,
            "NOTIFICATION_TIMER_INTERVAL": 600000,
            "SCRIPT_METADATA_LOAD_TIMER_INTERVAL": 1800000,
            "ASSESSOR_AUTH_COOKIE_NAME": "AssessorAuthCookie",
            "PASSWORD_RESET_URL": "http://localhost/PasswordChange/"
          },
          "backgroundworkerrefreshconfig": {
              "SCRIPT_IMAGE_DOWNLOADER": 3000,
              "BACKGROUND_IMAGES_DOWNLOAD_ENABLED": true
          },
          "cacheconfig": {
              "TWO_MINUTES_CACHE_TIME": 2,
              "THIRTY_MINUTES_CACHE_TIME": 30
          },
          "googleanalyticsconfig": {
              "GOOGLE_ANALYTICS_ENABLED":true,
              "GOOGLE_ANALYTICS_TRACKING_ID": "UA-78548194-1"
          },
          "marksandannotationsconfig": {
              "MARKS_AND_ANNOTATIONS_LOAD_TIMER_INTERVAL": 3000,
              "MARKS_AND_ANNOTATIONS_SAVE_TIMER_INTERVAL": 3000,
              "MARKS_AND_ANNOTATIONS_SAVE_RETRY_COUNT": 3,
              "MARKS_AND_ANNOTATIONS_SAVE_RETRY_ATTEMPT_TIME": 5000
          }
    },
    languageList = {
        "languages": {
            "awarding-body": "RM",
            "default-culture": "en-GB",
            "fallback-culture": "en-GB",
            "language": [
                {
                    "name": "English",
                    "code": "en-GB"
                },
                {
                    "name": "Deutsch",
                    "code": "de-DE"
                },
                {
                    "name": "Español",
                    "code": "es-ES"
                },
                {
                    "name": "Français",
                    "code": "fr-FR"
                },
                {
                    "name": "العربية",
                    "code": "ar-AR"
                }
            ]
        }
    },
    tagLists = [
        {
            "tagId": "1",
            "tagName": "Orange",
            "tagOrder": "5"
        },
        {
            "tagId": "2",
            "tagName": "Blue",
            "tagOrder": "2"
        },
        {
            "tagId": "3",
            "tagName": "Green",
            "tagOrder": "3"
        }
    ];
};