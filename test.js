module.exports = Test;

function Test(testName, iterations, description) {
	this.name = testName;
	this.iterations = iterations;
	this.description = description;
	this.results = [];
	this.errors = [];
	this.byLib = {};
}

Test.prototype = {
	addResult: function(libName, elapsed, computed) {
		var result = new Result(libName, this.iterations, elapsed, computed);

		this.byLib[libName] = result;
		this.results.push(result);
	},

	addError: function(libName, error) {
		this.errors.push({ name: libName, error: error });
	},

	getSortedResults: function() {
		return this.results.slice().sort(sortByTotal);
	},

	report: function() {
		console.log('');
		console.log('Test:', this.name, 'x', this.iterations);

		if(this.description) {
			console.log(this.description);
		}

		console.log('----------------------------------------------------------');
		console.log(columns([
			'Name',
			'Elapsed',
			'Average',
			'Diff'
		], 9));
		var results = this.getSortedResults();

		results.forEach(function(r) {
			var diff = difference(results[0].total, r.total);
			console.log(columns([
				r.name,
				formatNumber(r.total, 0, 'ms'),
				formatNumber(r.avg, 4, 'ms'),
				formatNumber(diff, 2, '%')
			], 9));
		});

		if(this.errors.length) {
			this.errors.forEach(function(e) {
				console.log(e.name, e.error);
			});
		}

	}
};

function sortByTotal(r1, r2) {
	return r1.total - r2.total;
}

function formatNumber(x, n, suffix) {
	return x === 0 ? '-' : Number(x).toFixed(n) + suffix;
}

function Result(name, iterations, time, value) {
	this.name = name;
	this.total = time;
	this.avg = time/iterations;
	this.value = value;
}

function difference(r1, r2) {
	return ((r2-r1) / r1) * 100;
}

function columns(cols, size) {
	var align = leftAlign;
	return cols.map(function(val) {
		var s = align(String(val), size);

		align = rightAlign;

		return s;
	}).join('');
}

function leftAlign(s, size) {
	while(s.length < size) {
		s = s + ' ';
	}

	return s;
}

function rightAlign(s, size) {
	while(s.length < size) {
		s = ' ' + s;
	}

	return ' ' + s;
}