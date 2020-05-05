//1:Book Class:
class Book{
    //method runs when we instantiate a book
    constructor(title, author, isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

//2:UI Class:
class UI{
    //don't want to instantiate the UI class,so make all methods static
    static displayBooks(){
        const books=Store.getBooks();
         //loop through the array
        books.forEach((book)=>UI.addBookToList(book));
    }

    static addBookToList(book){
        const list=document.querySelector('#book-list');
        //create a table row element
        const row=document.createElement('tr');

        row.innerHTML=`
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        //append a row to a list
        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            //parent element is the td,but I want to del tr, so use parElement() twice
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div=document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('.container');
        const form=document.querySelector('#book-form');
        //it means insert the div before form in container
        //the div(alert) will show before the form
        container.insertBefore(div,form);

        //disappear in 1 seconds
        setTimeout(()=>document.querySelector('.alert').remove(),1000);
    }

    static clearFields(){
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }
}

//3:Finally:!!!!!!!!Store Class:
//localstorage just for key-value pairs, cannot store object in local storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }else{
            //console.log(typeof localStorage.getItem('books')); string
            //JSON.parse converts string to js object
            books= JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books=Store.getBooks();
        books.push(book);
        //console.log(typeof books); object  ==>string json
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books=Store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn===isbn){
                //*del position;start from the position,how many items need to del)
                books.splice(index,1);
            }
        });
        //convert js object to string
        localStorage.setItem('books',JSON.stringify(books));
    }
}

//4::Event:Display Books
//as soon as the DOM loads
document.addEventListener('DOMContentLoaded',UI.displayBooks);

//5.1:Event: Add a book
document.querySelector('#book-form').addEventListener('submit',(e)=>{
    //prevent default actual submit
    e.preventDefault();
    //get form values
    //the input all has id 
    const title=document.querySelector('#title').value;  
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    //Validate before institate the Book
    if(title==='' || author==='' || isbn===''){
        UI.showAlert('please fill in all fields','danger')
    }else{
         //Instiatate Book
        const book=new Book(title,author,isbn);
        console.log(book);

        //Add book to UI(define above)
        UI.addBookToList(book);

        //Add book to store
        Store.addBook(book);

        //show success message
        UI.showAlert('Book Added','success')

        //Clear fields
        UI.clearFields();
    }
})

//5.2:Event: Remove a book
document.querySelector('#book-list').addEventListener('click',(e)=>{
    
    // console.log(e.target);
    // console.log(e.target.parentElement);
    // console.log(e.target.parentElement.previousElementSibling);
    // console.log(e.target.parentElement.previousElementSibling.textContent);
    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from store(get the isbn)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book deleted','success');


});
