const store = typeof sessionStorage['store'] != "undefined" ? JSON.parse(sessionStorage.store) :
    {
        LOGOUT: true,
        user_name: '',
        email: '',
        user_id: '',
        city: '',
        country: '',
        searched_book: '',
        books: '',
        sharedbooks: '',
    }

export default store