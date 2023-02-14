export default function calc(element) {
  let display = element.getElementsByTagName("input")[0];
  [...element.getElementsByTagName("button")].forEach(button => {
    switch (button.dataset.function) {
      case "clear":
        button.onclick = clear(display);
        break;
      case "solve":
        button.onclick = solve(display);
        break;
      case "backspace":
        button.onclick = backspace(display);
        break;
      case "mod":
        button.onclick = input(display, '%');
        break;
      case "decimal":
        button.onclick = input(display, '.');
        break;
      case "div":
        button.onclick = input(display, '/');
        break;
      case "mul":
        button.onclick = input(display, '*');
        break;
      case "add":
        button.onclick = input(display, '+');
        break;
      case "sub":
        button.onclick = input(display, '-');
        break;
      case "num-zero":
        button.onclick = input(display, 0);
        break;
      case "num-one":
        button.onclick = input(display, 1);
        break;
      case "num-two":
        button.onclick = input(display, 2);
        break;
      case "num-three":
        button.onclick = input(display, 3);
        break;
      case "num-four":
        button.onclick = input(display, 4);
        break;
      case "num-five":
        button.onclick = input(display, 5);
        break;
      case "num-six":
        button.onclick = input(display, 6);
        break;
      case "num-seven":
        button.onclick = input(display, 7);
        break;
      case "num-eight":
        button.onclick = input(display, 8);
        break;
      case "num-nine":
        button.onclick = input(display, 9);
        break;
    }
  });
}

function clear(display) {
  return () => display.value = '0';
}
function backspace(display) {
  return () => display.value = display.value.substr(0, display.value.length - 1);
}
function solve(display) {
  return () => {
    let solution = "Math Error";
    try {
      solution = eval(display.value);
      (solution.toString() == "NaN") && (solution = "Math Error");
    }
    catch (e) {}
    display.value = `${solution}`;
  }
}
function input(display, val) {
  return () => {
    if (display.value == "Math Error" || (display.value == '0' && parseInt(val)) || display.value == "Infinity")
      display.value = `${val}`;
    else
      display.value += `${val}`
  }
}
