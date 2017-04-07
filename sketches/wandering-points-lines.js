var path = new Path.Circle({
  center: [0, 0],
  radius: 1,
  fillColor: 'white',
  strokeColor: 'white'
});

var symbol = new Symbol(path);

var count = 15;

var symbols = [];

// Place the instances of the symbol:
for (var i = 0; i < count; i++) {
  // The center position is a random point in the view:
  var center = Point.random() * view.size;
  var placedSymbol = symbol.place(center);
  placedSymbol.direction = new Point.random();
  symbols.push(placedSymbol);
}

var lines = [];
var compound = new CompoundPath();

function onFrame(event) {
  // Run through the active layer's children list and change
  // the position of the placed symbols:
  compound.remove();
  compound.removeChildren();
  lines = [];
  // iterate over the array of points
  for (var i = 0; i < count; i++) {
    var item = symbols[i]
    item.position = item.position + item.direction
    // iterate over the rest of the points to search for pairs
    for(var j = i; j < count; j++) {
      symbol = symbols[j]
      if (item === symbol) continue;

      // draw a line if the two items are close to each other
      if(item.position.getDistance(symbol.position) < 300) {
        var line = new Path()
        line.strokeColor = 'white';
        line.add(item.position);
        line.add(symbol.position);
        lines.push(line);
      }

    }

    compound = new CompoundPath({
      children: lines,
      strokeColor: 'white',
    })

    // uncomment to add some weird behavior - fits the drawn lines to the view bounding boxes
    // compound.fitBounds(view.bounds)

    // If the item has left the view on the right, move it back
    // to the left:
    if (item.bounds.left > view.size.width || item.bounds.right < 0) {
      item.direction.x = item.direction.x * -1
    } else if (item.bounds.top < 0 || item.bounds.bottom > view.size.height) {
      item.direction.y = item.direction.y * -1
    }
  }
}