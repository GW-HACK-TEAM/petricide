GameCell = function GameCell(i, j, ctx, size, cellLifecycle, nodes) {
  this.activeNeighBours = [];
  this.counts = {};
  this.cellLifecycle = cellLifecycle;
  this.nodes = nodes;
  this.lon = i;
  this.lat = j;
  this.health = 0;
  this.color = 'white';
  this.activeColor = this.color;
  this.active = false;
  this.age = 0;
  this.ctx = ctx;
  this.size = size;
  this.inactiveCount = 0;

  this.cachedNeighbours = [];
};

GameCell.prototype.activate = function activate(color) {
  this.color = color;
  this.active = true;
  this.changeHealth(5);
  this.draw(color);
};

GameCell.prototype.draw = function draw(color) {
  if ( color !== 'white' ) {
  }
  this.ctx.fillStyle = color === 'white' ? 'white' : GameColorRanges[color][this.health];
  this.ctx.fillRect(this.lon * this.size, this.lat * this.size, this.size, this.size);
};

GameCell.prototype.changeHealth = function changeHealth(val) {
  // Health can only be an integer
  val = Math.round(val);
  this.health = this.health + val;
  if (this.health > 100) {
    this.health = 100;
  }
  if (this.health < 0) {
    this.health = 0;
  }

  this.draw(this.color);

  if (this.health === 0) {
    this.kill();
  }
};

GameCell.prototype.kill = function kill(explode) {
  var _self = this;
  this.age = 0;
  this.active = false;
  this.inactiveCount = 5;
  if ( explode ) {
    this.neighbours().forEach(function(item) {
      if ( item.active && item.color !== _self.color ) {
        item.changeHealth(-50);
      }
    });
  }
};

GameCell.prototype.mode = function mode(array) {
  if(array.length === 0)
    return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] === null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if(modeMap[el] > maxCount)
      {
        maxEl = el;
        maxCount = modeMap[el];
      }
  }
  return maxEl;
};

GameCell.prototype.update = function update(cb) {
  var _self = this;
  if ( _self.active ) {
    _self.age++;

    if ( _self.age < _self.cellLifecycle * 0.6 ) {
      _self.changeHealth(3);
    } else if ( _self.health > 20 ) {
      _self.changeHealth(-4);
    }
    if ( _self.age > _self.cellLifecycle ) {
      _self.age = 0;
    }
  }

  if ( _self.inactiveCount > 0 ) {
    _self.inactiveCount--;
    return cb();
  }
  _self.activeNeighBours = _.filter(_self.neighbours(), function(item) {
    return item.active && item.health >= 25;
  });

  if (!_self.active && _self.activeNeighBours.length === 0) {
    return cb();
  }

  if ( !_self.active && _self.activeNeighBours.length >= 3 ) {
    _self.counts = _.countBy(_self.activeNeighBours, function(item) {
      return item.color;
    });
    if ( _(_self.counts).values().sort().pop() >= 3 ) {
      _self.activeColor = _self.mode(_(_self.activeNeighBours).pluck('color'));
      _self.activate(_self.activeColor);
    }
  }

  // Check if the cell is encircled
  if ( _self.active && _self.activeNeighBours.length >= 6 ) {
    var count = 0;
    _self.activeNeighBours.forEach(function(cell) {
      if ( cell.color !== _self.color ) {
        count++;
      }
    });
    if ( count >= 6 ) {
      _self.kill();
    }
  }

  cb();
};

GameCell.prototype.neighbours = function neighbours() {
  var arr = [];
  var nodes = this.nodes;
  var i = this.lon;
  var j = this.lat;

  if (this.cachedNeighbours.length) {
    return this.cachedNeighbours;
  }
  if (nodes[i - 1]) {
    if (nodes[i - 1][j - 1]) {
      arr.push(nodes[i - 1][j - 1]);
    }
    if (nodes[i - 1][j]) {
      arr.push(nodes[i - 1][j]);
    }
    if (nodes[i - 1][j + 1]) {
      arr.push(nodes[i - 1][j + 1]);
    }
  }
  if (nodes[i][j - 1]) {
    arr.push(nodes[i][j - 1]);
  }
  if (nodes[i][j + 1]) {
    arr.push(nodes[i][j + 1]);
  }
  if (nodes[i + 1]) {
    if (nodes[i + 1][j - 1]) {
      arr.push(nodes[i + 1][j - 1]);
    }
    if (nodes[i + 1][j]) {
      arr.push(nodes[i + 1][j]);
    }
    if (nodes[i + 1][j + 1]) {
      arr.push(nodes[i + 1][j + 1]);
    }
  }

  return arr;
};

GameCell.prototype.clickEffect = function clickEffect(myColor) {
  var  val = 60;
  if ( this.active && this.color !== myColor ) {
    val = 0 - val;
    this.changeHealth(val);
  } else if ( !this.active ) {
    this.activate(myColor);
    this.playerActivated = true;
  } else if (this.active && this.color === myColor) {
    this.changeHealth(60);
    this.age = 0;
    this.neighbours().forEach(function(item) {
      if ( item.active && item.color === myColor ) {
        item.changeHealth(val * 0.6);
        item.age = 0;
      }
    });
  }
  this.neighbours().forEach(function(item) {
    if ( item.active && item.color !== myColor ) {
      item.changeHealth(val);
    }
  });
};
