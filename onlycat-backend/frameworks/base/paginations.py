from rest_framework import pagination
from rest_framework.response import Response


class BasePagination(pagination.PageNumberPagination):
    page_size_query_param = 'size'
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'current': self.page.number,
            'pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'results': data
        })
    
    def get_paginated_response_schema(self, schema):
        return {
            'type': 'object',
            # 'required': ['count', 'results'],
            'properties': {
                'links': {
                    'type': 'object',
                    'properties': {
                        'next': {
                            'type': 'string',
                            'nullable': True,
                            'format': 'uri',
                            'example': 'http://api.example.org/accounts/?{page_query_param}=4'.format(page_query_param=self.page_query_param)
                        },
                        'previous': {
                            'type': 'string',
                            'nullable': True,
                            'format': 'uri',
                            'example': 'http://api.example.org/accounts/?{page_query_param}=2'.format(page_query_param=self.page_query_param)
                        },
                    }
                },
                'current': {
                    'type': 'integer',
                    'example': 123,
                },
                'pages': {
                    'type': 'integer',
                    'example': 123,
                },
                'count': {
                    'type': 'integer',
                    'example': 123,
                },
                'results': schema,
            },
        }
