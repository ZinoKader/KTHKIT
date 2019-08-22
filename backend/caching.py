def make_authorized_cache_key(*args, **kwargs):
    path = request.path
    auth = request.authorization['username']
    return (path + auth).encode('utf-8')
