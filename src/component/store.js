const store = typeof localStorage['store'] != "undefined" ? JSON.parse(localStorage.store) :
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