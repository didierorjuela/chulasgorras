import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { saveAs } from 'file-saver';

import 'fabric'
declare const fabric: any;

/* ES6 */
import htmlToImage from 'html-to-image';
/* ES5 */
// var htmlToImage = require('html-to-image');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  playeracircular: any;
  props: any = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  textString: string;
  url: string = '';
  size: any = {
    width: 500,
    height: 800
  };

  json: any;
  globalEditor: boolean = false;
  textEditor: boolean = false;
  imageEditor: boolean = false;
  figureEditor: boolean = false;
  selected: any;

  constructor() { }

  ngOnInit() {

    //setup front side canvas
    this.playeracircular = new fabric.Canvas('playeracircular', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue'
    });

    this.playeracircular.on({
      'object:moving': (e) => { },
      'object:modified': (e) => { },
      'object:selected': (e) => {

        let selectedObject = e.target;
        this.selected = selectedObject
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
            //   console.log('image');
              break;
          }
        }
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
      }
    });

    // this.canvas.setWidth(this.size.width);
    // this.canvas.setHeight(this.size.height);

    this.playeracircular.setWidth(500);
    this.playeracircular.setHeight(600);

    // get references to the html canvas element & its context
    // this.canvas.on('mouse:down', (e) => {
    // let canvasElement: any = document.getElementById('canvas');
    // console.log(canvasElement)
    // });

  }

  descargar() {
    htmlToImage.toBlob(document.getElementById('captura'))
    .then(function (blob) {
        
        saveAs(blob, 'my-node.png');
    });
  }

  /*------------------------Block elements------------------------*/

  //Block "Size"

  changeSize(event: any) {
    this.playeracircular.setWidth(this.size.width);
    this.playeracircular.setHeight(this.size.height);
  }

  //Block "Add text"

  addText() {
    let textString = this.textString;
    let text = new fabric.IText(textString, {
      left: 100,
      top: 100,
      fontFamily: 'helvetica',
      angle: 0,
      fill: '#000000',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.playeracircular.add(text);
    this.selectItemAfterAdded(text);
    this.textString = '';
  }

  //Block "Add images"

//   getImgPolaroid(event: any) {
//     let el = event.target;
//     fabric.Image.fromURL(el.src, (image) => {
//       image.set({
//         left: 10,
//         top: 10,
//         angle: 0,
//         padding: 10,
//         cornersize: 10,
//         hasRotatingPoint: true,
//         peloas: 12
//       });
//       image.setw.setWidth(150);
//       image.setHeight(150);
//       this.extend(image, this.randomId());
//       this.canvas.add(image);
//       this.selectItemAfterAdded(image);
//     });
//   }

  //Block "Upload Image"

  addImageOnCanvas(url) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 100,
          top: 100,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true
        });
        image.setWidth = 100;
        image.setHeight = 100;
        this.extend(image, this.randomId());
        this.playeracircular.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target['result'];
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  };

  //Block "Add figure"

  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangulo':
        add = new fabric.Rect({
          width: 200, height: 100, left: 100, top: 100, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'cuadrado':
        add = new fabric.Rect({
          width: 100, height: 100, left: 100, top: 100, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangulo':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 100, top: 100, fill: '#2196f3'
        });
        break;
      case 'circulo':
        add = new fabric.Circle({
          radius: 50, left: 100, top: 100, fill: '#ff5722'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.playeracircular.add(add);
    // this.selectItemAfterAdded(add);
  }

  /*Canvas*/

  cleanSelect() {
    // this.canvas.deactivateAllWithDispatch().renderAll();
  }

  selectItemAfterAdded(obj) {
    // this.canvas.deactivateAllWithDispatch().renderAll();
    this.playeracircular.setActiveObject(obj);
  }

  setCanvasFill() {
    // console.log(this.props.canvasImage);
    if (!this.props.canvasImage) {
      this.playeracircular.backgroundColor = this.props.canvasFill;
      this.playeracircular.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    let self = this;
    if (this.props.canvasImage) {
      this.playeracircular.setBackgroundColor({ source: this.props.canvasImage, repeat: 'repeat' }, function () {
        // self.props.canvasFill = '';
        self.playeracircular.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName, object) {
    object = object || this.playeracircular.getActiSveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  }


  setActiveStyle(styleName, value, object) {
    object = object || this.playeracircular.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    }
    else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.playeracircular.renderAll();
  }


  getActiveProp(name) {
    var object = this.playeracircular.getActiveObject();
    if (!object) return '';

    return object[name] || '';
  }

  setActiveProp(name, value) {
    var object = this.playeracircular.getActiveObject();
    if (!object) return;
    object.set(name, value).setCoords();
    this.playeracircular.renderAll();
  }

  clone() {
    let activeObject = this.playeracircular.getActiveObject(),
      activeGroup = this.getSelection();// this.canvas.getActiveGroup();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.playeracircular.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  getId() {
    this.props.id = this.playeracircular.getActiveObject().toObject().id;
  }

  setId() {
    let val = this.props.id;
    let complete = this.playeracircular.getActiveObject().toObject();
    // console.log(complete);
    this.playeracircular.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  getFontStyle() {
    this.props.fontStyle = this.getActiveStyle('fontStyle', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    this.setActiveStyle('fontStyle', this.props.fontStyle ? 'italic' : '', null);
  }


  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, "g"), "");
    } else {
      iclass += ` ${value}`
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }


  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {

    let activeObject = this.playeracircular.getActiveObject(),
      activeGroup = this.getSelection(); // this.canvas.getActiveGroup();

    if (activeObject) {
      this.playeracircular.remove(activeObject);
      // this.textString = '';
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.playeracircular.discardActiveGroup();
      let self = this;
      objectsInGroup.forEach(function (object) {
        self.playeracircular.remove(object);
      });
    }
  }

  bringToFront() {
    let activeObject = this.playeracircular.getActiveObject(),
      activeGroup = this.getSelection(); // this.canvas.getActiveGroup();

    if (activeObject) {
      activeObject.bringToFront();
      // activeObject.opacity = 1;
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.playeracircular.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    let activeObject = this.playeracircular.getActiveObject(),
      activeGroup = this.getSelection(); // this.canvas.getActiveGroup();

    if (activeObject) {
      activeObject.sendToBack();
      // activeObject.opacity = 1;
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.playeracircular.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    if (confirm('¿Estás seguro de eliminar los avances en el diseño?')) {
      this.playeracircular.clear();
    }
  }

  rasterize() {
    if (!fabric.playeracircular.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      //console.log(this.canvas.toDataURL('png'))
      //window.open(this.canvas.toDataURL('png'));
      var image = new Image();
      image.src = this.playeracircular.toDataURL('png')
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
  }

  rasterizeSVG() {
    //console.log(this.canvas.toSVG())
    // window.open(
    //   'data:image/svg+xml;utf8,' +
    //   encodeURIComponent(this.canvas.toSVG()));
    // console.log(this.canvas.toSVG())
    // var image = new Image();
    // image.src = this.canvas.toSVG()
    var w = window.open("");
    w.document.write(this.playeracircular.toSVG());
  };


  saveCanvasToJSON() {
    let json = JSON.stringify(this.playeracircular);
    localStorage.setItem('Kanvas', json);
    // console.log('json');
    // console.log(json);

  }

  loadCanvasFromJSON() {
    let CANVAS = localStorage.getItem('Kanvas');
    // console.log('CANVAS');
    // console.log(CANVAS);

    // and load everything from the same json
    this.playeracircular.loadFromJSON(CANVAS, () => {
    //   console.log('CANVAS untar');
    //   console.log(CANVAS);

      // making sure to render canvas at the end
      this.playeracircular.renderAll();

      // and checking if object's "name" is preserved
    //   console.log('this.canvas.item(0).name');
    //   console.log(this.canvas);
    });

  };

  rasterizeJSON() {
    this.json = JSON.stringify(this.playeracircular, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

  getSelection(){
    return this.playeracircular.getActiveObject() == null ? this.playeracircular.getActiveGroup() : this.playeracircular.getActiveObject()
  }

}

