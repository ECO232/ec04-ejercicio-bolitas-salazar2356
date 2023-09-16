class Item {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
  }
  show() {
    fill(this.r, this.g, this.b);
    ellipse(this.x, this.y, 20, 20);
  }
}

const apiUrlForGet = "http://127.0.0.1:3000/items";
const apiUrlForPost = "http://127.0.0.1:3000/items";

async function fetchItems() {
  try {
    const response = await fetch(apiUrlForGet);
    if (!response.ok) {
      throw new Error(`HTTP error: Status: ${response.status}`);
    }
    const itemsData = await response.json();
    return itemsData.items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

let items = [];

function setup() {
  createCanvas(400, 400);
  // Recuperar las elipses almacenadas en el almacenamiento local
  const storedItems = JSON.parse(localStorage.getItem('items'));
  if (storedItems) {
    items = storedItems.map(itemData => new Item(itemData.x, itemData.y, itemData.r, itemData.g, itemData.b));
  }

  fetchItems()
    .then(data => {
      console.log('Fetched items:', data);
      data.forEach(itemData => {
        items.push(new Item(itemData.x, itemData.y, itemData.r, itemData.g, itemData.b));
      });
      redraw();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function draw() {
  background(220);
  items.forEach(item => {
    item.show();
  });
}

function mousePressed() {
  const newItem = new Item(mouseX, mouseY, random(255), random(255), random(255));
  items.push(newItem);

  // Guarda las elipses en el almacenamiento local
  localStorage.setItem('items', JSON.stringify(items));

  postNewItem(newItem)
    .then(responseData => {
      if (responseData) {
        console.log('Item posted successfully:', responseData);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  redraw();
}

async function postNewItem(data) {
  try {
    const response = await fetch(apiUrlForPost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error: Status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('Error posting item:', error);
    return null;
  }
}
