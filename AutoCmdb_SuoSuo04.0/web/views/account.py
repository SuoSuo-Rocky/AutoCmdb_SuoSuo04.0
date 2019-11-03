from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.views import View
from repository.models import  *
import json


class AutoIndex(View):
    def get(self,request,*args,**kwrags):

        return render(request,'index.html',locals())

class AutoCmdb(View):
    def get(self,request,*args,**kwargs):

        return render(request,'cmdb.html',locals())

class AutoAddr(View):
    def get(self,request,*args,**kwargs):
        return render(request,'show_addr.html',{"target": kwargs['target']})

def test(request):
    table_config = [
        {
            'q': None,
            'title': '选项',
            'display': True,
            'text': {'content':'<input type="checkbox" />','kwargs': {}},
            'attrs': {},
        },
        {
            'q': 'id',
            'title': 'ID',
            'display': False,
            'attrs': {},
        },
        {
            'q': 'device_type_id',
            'title': '资产类型',
            'display': True,
            'text': {'content':"{n}",'kwargs':{'n':'@@device_type_choices '}},
            'attrs': {'edit-enable': 'true','edit-type': 'select',
                      'global_name':'device_type_choices','origin': '@device_type_id'},
        },
        {
            'q': 'device_status_id',
            'title': '状态',
            'display': True,
            'text': {'content':"{n}",'kwargs':{'n':'@@device_status_choices '}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'select',
                      'global_name':'device_status_choices','origin': '@device_status_id'},
        },
        {
            'q': 'idc__name',
            'title': '机房名',
            'display': True,
            'text': {'content':"{n}",'kwargs':{'n':'@idc__name'}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'input'},
        },
        {
            'q': 'cabinet_num',
            'title': '机柜号',
            'display': True,
            'text': {'content': '{n}-{m}','kwargs': {'n': '机柜号', 'm': '@cabinet_num'}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'input'},
        },
        {
            'q': 'cabinet_order',
            'title': '机柜中序号',
            'display': True,
            'text': {'content': '{n}-{m}', 'kwargs': {'n': '机柜中序号', 'm': '@cabinet_order'}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'input'},
        },
        {
            'q': None,
            'title': '操作',
            'display': True,
            'text': {'content': '<a href="#">{n}</a>', 'kwargs': {'n': "更多操作",}},
            'attrs': {}
        }
    ]
    q_list = []
    for i in table_config:
        if not i['q']:
            continue
        q_list.append(i['q'])
    from repository.models import Asset
    data_list = Asset.objects.all().values(*q_list)
    data_list = list(data_list)


    result = {
        'table_config': table_config,
        'data_list': data_list,
        'global_dict': {
            'device_type_choices': Asset.device_type_choices,
            'device_status_choices': Asset.device_status_choices,
        },
        # 分页组件生成页码信息
        'pager': """<li><a>1</a></li><li><a>2</a></li><li><a>3</a></li><li><a>4</a></li><li><a>5</a></li>"""
    }

    return HttpResponse(json.dumps(result))

def business(request):
    table_config = [
        {
            'q': None,
            'title': '选项',
            'display': True,
            'text': {'content': '<input type="checkbox" />', 'kwargs': {}},
            'attrs': {},
        },
        {
            'q': 'id',
            'title': 'ID',
            'display': False,
            'attrs': {},
        },
        {
            'q': 'name',
            'title': '业务线名称',
            'display': True,
            'text': {'content': "{n}", 'kwargs': {'n': '@name'}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'input',
                      'origin': '@name'},
        },
        {
            'q': 'contact_id',  # 为 数据库 查询数据 做准备
            'title': '',
            'display': False,
            'text': {},
            'attrs': {},
        },
        {
            'q': 'contact__name',
            'title': '联系人组',
            'display': True,
            'text': {'content': "{n}", 'kwargs': {'n': '@contact__name'}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'select',
                      'origin': '@contact_id','global_name': 'UserGroup'},
        },
        {
            'q': 'manager_id',
            'title': '',
            'display': False,
            'text': {},
            'attrs': {},
        },
        {
            'q': 'manager__name',
            'title': '管理员组',
            'display': True,
            'text': {'content': '{n}', 'kwargs': {'n': '@manager__name',}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'select',
                      'origin': '@manager_id','global_name': 'UserGroup'},
        },
        {
            'q': None,
            'title': '操作',
            'display': True,
            'text': {'content': '<a href="#">{n}</a>', 'kwargs': {'n': "更多操作"}},
            'attrs': {}
        }
    ]
    q_list = []
    data_list = {}
    for s in table_config:
        if not s['q']:
            continue
        q_list.append(s['q'])
    data_list = BusinessUnit.objects.all().values(*q_list)
    print("data_list=" , data_list)
    data_list = list(data_list)

    result = {
        'table_config': table_config,
        'data_list': data_list,
        'global_dict': {
            'UserGroup': list(UserGroup.objects.all().values_list('id','name')),
        },
        # 分页组件生成页码信息
        'pager': """<li><a>1</a></li><li><a>2</a></li><li><a>3</a></li><li><a>4</a></li><li><a>5</a></li>"""
    }

    return HttpResponse(json.dumps(result))

def user(request):
    table_config = [
        {
            'q': None,
            'title': '选项',
            'display': True,
            'text': {'content': '<input type="checkbox" />', 'kwargs': {}},
            'attrs': {},
        },
        {
            'q': 'id',
            'title': 'ID',
            'display': False,
            'attrs': {},
        },
        {
            'q': 'name',
            'title': '业务线名称',
            'display': True,
            'text': {'content': "{n}", 'kwargs': {'n': '@name'}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'input',
                      'origin': '@name'},
        },
        {
            'q': 'contact_id',  # 为 数据库 查询数据 做准备
            'title': '',
            'display': False,
            'text': {},
            'attrs': {},
        },
        {
            'q': 'contact__name',
            'title': '联系人组',
            'display': True,
            'text': {'content': "{n}", 'kwargs': {'n': '@contact__name'}},
            'attrs': {'edit-enable': 'true', 'edit-type': 'select',
                      'origin': '@contact_id', 'global_name': 'UserGroup'},
        },
        {
            'q': 'manager_id',
            'title': '',
            'display': False,
            'text': {},
            'attrs': {},
        },
        {
            'q': 'manager__name',
            'title': '管理员组',
            'display': True,
            'text': {'content': '{n}', 'kwargs': {'n': '@manager__name', }},
            'attrs': {'edit-enable': 'true', 'edit-type': 'select',
                      'origin': '@manager_id', 'global_name': 'UserGroup'},
        },
        {
            'q': None,
            'title': '操作',
            'display': True,
            'text': {'content': '<a href="#">{n}</a>', 'kwargs': {'n': "更多操作"}},
            'attrs': {}
        }
    ]
    q_list = []
    data_list = {}
    for s in table_config:
        if not s['q']:
            continue
        q_list.append(s['q'])
    data_list = BusinessUnit.objects.all().values(*q_list)
    print("data_list=", data_list)
    data_list = list(data_list)

    result = {
        'table_config': table_config,
        'data_list': data_list,
        'global_dict': {
            'UserGroup': list(UserGroup.objects.all().values_list('id', 'name')),
        },
        # 分页组件生成页码信息
        'pager': """<li><a>1</a></li><li><a>2</a></li><li><a>3</a></li><li><a>4</a></li><li><a>5</a></li>"""
    }

    return HttpResponse(json.dumps(result))

def shiwei(request):
    obj = BusinessUnit.objects.all().values('name','contact__name')
    print(obj)

    return render(request,'shiwei.html',)







