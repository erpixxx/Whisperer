document.getElementById('heightSlider').addEventListener('input', function () {
    var newHeight = this.value + 'px';
    document.getElementById('domFrame').style.height = newHeight;
    document.getElementById('sliderValue').innerHTML = newHeight;
});