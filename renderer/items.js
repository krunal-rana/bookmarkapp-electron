const fs = require('fs')

let items = document.getElementById('items')

// reader JS
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Listen form done button
window.addEventListener('message', e => {
     // console.log(e.data)

    // Check for correct message
    if (e.data.action == 'delete-reader-item') {

         // Delete item at given index
    this.delete(e.data.itemIndex)
        // Close reade window
        e.source.close()
    }


})

exports.delete = itemIndex => {
    // Remove item from DOM
    items.removeChild(items.childNodes[itemIndex] )

    //Remove item from storage
    this.storage.splice(itemIndex,1)

    this.save()
    
    // Slecte previous item or first one
    if(this.storage.length){
        let newItemSelectedItemIndex = (itemIndex ===0) ? 0 : itemIndex-1
        document.getElementsByClassName('read-item')[newItemSelectedItemIndex].classList.add('selected')
    }
    
}

// Get selecte item index
exports.getSelectedITem = () => {
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // Get item index
    let itemIndex = 0
    let child = currentItem
    while ((child = child.previousElementSibling) != null) itemIndex++

    return { node: currentItem, index: itemIndex }

}

// Perssit to storage
exports.save = () => {

    localStorage.setItem('readit-items', JSON.stringify(this.storage))

}
// set item selected

exports.select = e => {
    // document.getElementsByClassName('read-item selected')[0].classList.remove('selected')
    this.getSelectedITem().node.classList.remove('selected')
    // add clicked item
    e.currentTarget.classList.add('selected')
}

// Move selection

exports.changeSelection = direction => {
    //let currentItem = document.getElementsByClassName('read-item selected')[0]
    let currentItem = this.getSelectedITem()
    // Handle up/down

    if (direction === 'ArrowUp' && currentItem.node.previousElementSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.previousElementSibling.classList.add('selected')

    } else if (direction === 'ArrowDown' && currentItem.node.nextElementSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.nextElementSibling.classList.add('selected')
    }
}

// Open selected item
exports.open = () => {

    //check if we have items in menu option
    if (!this.storage.length) return

    // get Slected Items this.getSelectedITem()
    // let selectedItem = document.getElementsByClassName('read-item selected')[0]
    let selectedItem = this.getSelectedITem()
    // get the items url
    let contentURL = selectedItem.node.dataset.url


    // Open item in proxy BrowserWindow
    let readerWin = window.open(contentURL, '', `
        maxWidth = 2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    `)

    // Inject

    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index))



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