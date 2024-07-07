class CustomHTMLException(Exception):
    def __init__(self, msg):
        self.msg = msg


class PhoneRequired(CustomHTMLException):
    def __init__(self):
        super().__init__("Поле 'Телефон' должно быть заполнено")
        self.status_code = 400


class PhoneInvalid(CustomHTMLException):
    def __init__(self):
        super().__init__("Неверный формат телефона")
        self.status_code = 400
