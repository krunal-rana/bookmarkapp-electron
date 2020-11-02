let items = document.getElementById('items')

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Perssit to storage
exports.save = () => {

    localStorage.setItem('readit-items', JSON.stringify(this.storage))

}
// set item selected

exports.select = e => {
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected')

    // add clicked item
    e.currentTarget.classList.add('selected')
}

// Move selection

exports.changeSelection = direction => {
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // Handle up/down

    if (direction === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.previousElementSibling.classList.add('selected')

    } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.nextElementSibling.classList.add('selected')
    }
}

// Open selected item
exports.open = ()=> {

    //check if we have items in menu option
    if( !this.storage.length) return

    // get Slected Items
    let selectedItem = document.getElementsByClassName('read-item selected')[0]

    // get the items url
    let contentURL = selectedItem.dataset.url

    console.log('Opening url: ', contentURL)

}


// Add new item

exports.addItem = (item, isNew = false) => {

    //
    let itemNode = document.createElement('div')

    itemNode.setAttribute('class', 'read-item')

    // set item url
    itemNode.setAttribute('data-url', item.url)

    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    items.appendChild(itemNode)

    // Attach click handler
    itemNode.addEventListener('click', this.select)

    // select function
    itemNode.addEventListener('dblclick', this.open)

    //If this is the first item select it
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected')
    }

    // add item to storage
    if (isNew) {
        this.storage.push(item)
        this.save()
    }

}

// Add items from storage when app loads
this.storage.forEach(item => {
    this.addItem(item)

})