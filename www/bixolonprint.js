/*
 *
 * Copyright (C) 2013 Alfonso Vinti <me@alfonsovinti.it>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * @type {exports}
 */
var cordova = require('cordova');
var exec = require('cordova/exec');

/**
 * BixolonPrint
 * @constructor
 */
var BixolonPrint = function () {
  var _this = this;

  /**
   *
   * @type {string}
   */
  this.version = "1.7.1";

  /**
   *
   * @type {Array}
   */
  this.textLines = [];

  /**
   *
   * @type {{lineFeed: number, formFeed: boolean, autoConnect: boolean, toastMessage: boolean, separator: string, codePage: number}}
   */
  this.settings = {
    lineFeed: 0,
    formFeed: true,
    autoConnect: true, // Android only
    toastMessage: true, // Android only
    separator: '=',
    codePage: 16
  };

  /**
   *
   * @type {{LEFT: string, CENTER: string, RIGHT: string}}
   */
  this.TextAlign = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
  };

  /**
   *
   * @type {{A: string, B: string, C: string}}
   */
  this.FontType = {
    A: 'A',
    B: 'B',
    C: 'C'
  };

  /**
   *
   * @type {{DEFAULT: string, BOLD: string, UNDERLINE: string, UNDERLINE2: string, REVERSE: string}}
   */
  this.FontStyle = {
    DEFAULT: 'default',
    BOLD: 'bold',
    UNDERLINE: 'underline',
    UNDERLINE2: 'underline2',
    REVERSE: 'reversed'
  };

  /**
   *
   * @type {{TD_0: number, TD_1: number, TD_2: number, TD_3: number, TD_4: number, TD_5: number, TD_6: number, TD_7: number}}
   */
  this.TextDimension = {
    TD_0: 0,
    TD_1: 1,
    TD_2: 2,
    TD_3: 3,
    TD_4: 4,
    TD_5: 5,
    TD_6: 6,
    TD_7: 7
  };

  /**
   *
   * @type {{CP_437_USA: number, CP_KATAKANA: number, CP_850_MULTILINGUAL: number, CP_860_PORTUGUESE: number, CP_863_CANADIAN_FRENCH: number, CP_865_NORDIC: number, CP_1252_LATIN1: number, CP_866_CYRILLIC2: number, CP_852_LATIN2: number, CP_858_EURO: number, CP_862_HEBREW_DOS_CODE: number, CP_864_ARABIC: number, CP_THAI42: number, CP_1253_GREEK: number, CP_1254_TURKISH: number, CP_1257_BALTIC: number, CP_FARSI: number, CP_1251_CYRILLIC: number, CP_737_GREEK: number, CP_775_BALTIC: number, CP_THAI14: number, CP_1255_HEBREW_NEW_CODE: number, CP_THAI11: number, CP_THAI18: number, CP_855_CYRILLIC: number, CP_857_TURKISH: number, CP_928_GREEK: number, CP_THAI16: number, CP_1256_ARABIC: number, CP_1258_VIETNAM: number, CP_KHMER_CAMBODIA: number, CP_1250_CZECH: number}}
   */
  this.CodePage = {
    CP_437_USA: 0,
    CP_KATAKANA: 1,
    CP_850_MULTILINGUAL: 2,
    CP_860_PORTUGUESE: 3,
    CP_863_CANADIAN_FRENCH: 4,
    CP_865_NORDIC: 5,
    CP_1252_LATIN1: 16,
    CP_866_CYRILLIC2: 17,
    CP_852_LATIN2: 18,
    CP_858_EURO: 19,
    CP_862_HEBREW_DOS_CODE: 21,
    CP_864_ARABIC: 22,
    CP_THAI42: 23,
    CP_1253_GREEK: 24,
    CP_1254_TURKISH: 25,
    CP_1257_BALTIC: 26,
    CP_FARSI: 27,
    CP_1251_CYRILLIC: 28,
    CP_737_GREEK: 29,
    CP_775_BALTIC: 30,
    CP_THAI14: 31,
    CP_1255_HEBREW_NEW_CODE: 33,
    CP_THAI11: 34,
    CP_THAI18: 35,
    CP_855_CYRILLIC: 36,
    CP_857_TURKISH: 37,
    CP_928_GREEK: 38,
    CP_THAI16: 39,
    CP_1256_ARABIC: 40,
    CP_1258_VIETNAM: 41,
    CP_KHMER_CAMBODIA: 42,
    CP_1250_CZECH: 43
  };

  this.BarCodeSystem = {
    UPC_A: 65,
    UPC_E: 66,
    EAN13: 67,
    EAN8: 68,
    CODE39: 69,
    ITF: 70,
    CODABAR: 71,
    CODE93: 72,
    CODE128: 73
  };

  this.BarCodeCharacterPosition = {
    NOT_PRINTED: 0,
    ABOVE_BAR_CODE: 1,
    BELOW_BAR_CODE: 2,
    ABOVE_AND_BELOW_BAR_CODE: 3
  };

  this.QRCodeModel = {
    MODEL_1: 49,
    MODEL_2: 50
  };

  this.msrReaderReadCallback = null;
  this.connectionCallback = null;

  //image alignment
  this.ALIGNMENT = {
    ASIS: -11,
    LEFT: -1,
    CENTER: -2,
    RIGHT: -3
  };
};

/**
 * @param obj
 * @returns {boolean}
 * @private
 */
BixolonPrint.prototype._isObject = function (obj) {
  return typeof obj === 'object' && !!obj;
};

/**
 *
 * @param obj
 * @returns {boolean}
 * @private
 */
BixolonPrint.prototype._isFunction = function (obj) {
  return typeof obj === 'function';
};

/**
 *
 * @param separator
 */
BixolonPrint.prototype.addHr = function (separator) {

  // default separator
  var sp = this.settings.separator;

  if ((typeof separator == 'string' || separator instanceof String) && separator.length == 1) {
    sp = separator;
  } else if (!!separator) {
    throw new Error("BixolonPrint.addHr failure: separator must be a string!");
  }

  this.addLine('[hr]' + sp);
};

/**
 *
 * @param obj
 */
BixolonPrint.prototype.addLine = function (obj) {

  var rObj = {
    text: '',
    textAlign: this.TextAlign.LEFT,
    textWidth: this.TextDimension.TD_0,
    textHeight: this.TextDimension.TD_0,
    fontType: this.FontType.A,
    fontStyle: this.FontStyle.DEFAULT
  };

  if (typeof obj == 'string' || obj instanceof String) {
    rObj.text = obj;
  } else if (this._isObject(obj) && (typeof obj.text == 'string' || obj.text instanceof String)) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        switch (key) {
          case 'text':
            rObj.text = obj[key];
            break;
          case 'align':
          case 'textAlign':
            rObj.textAlign = obj[key];
            break;
          case 'width':
          case 'textWidth':
            rObj.textWidth = obj[key];
            break;
          case 'height':
          case 'textHeight':
            rObj.textHeight = obj[key];
            break;
          case 'type':
          case 'fontType':
            rObj.fontType = obj[key];
            break;
          case 'style':
          case 'fontStyle':
            rObj.fontStyle = obj[key];
            break;
        }
      }
    }
  } else {
    throw new Error("BixolonPrint.addLine failure: text parameter not found!");
  }

  this.textLines.push(rObj);
};

/**
 *
 * @param successCallback
 * @param errorCallback
 * @param config
 */
BixolonPrint.prototype.printQRCode = function (data, successCallback, errorCallback, config) {

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.printQRCode success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.warn('BixolonPrint.printQRCode failure: ' + error);
    };
  }

  var printConfig = this.settings;
  config = config || {};
  data = data || {};

  if (!this._isObject(config)) {
    throw new Error("BixolonPrint.printQRCode failure: config parameter must be a object!");
  }

  if (!this._isObject(data)) {
    throw new Error("BixolonPrint.printQRCode failure: data parameter must be a object!");
  }

  if (config.formFeed === false || config.formFeed === true) {
    printConfig.formFeed = config.formFeed;
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "printQRCode", [data, printConfig]
  );
};

/**
 *
 * @param successCallback
 * @param errorCallback
 * @param config
 */
BixolonPrint.prototype.printBarCode = function (data, successCallback, errorCallback, config) {

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.printBarCode success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.warn('BixolonPrint.printBarCode failure: ' + error);
    };
  }

  var printConfig = this.settings;
  config = config || {};
  data = data || {};

  if (!this._isObject(config)) {
    throw new Error("BixolonPrint.printBarCode failure: config parameter must be a object!");
  }

  if (!this._isObject(data)) {
    throw new Error("BixolonPrint.printBarCode failure: data parameter must be a object!");
  }

  if (config.formFeed === false || config.formFeed === true) {
    printConfig.formFeed = config.formFeed;
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "printBarCode", [data, printConfig]
  );
};

/**
 *
 * @param successCallback
 * @param errorCallback
 * @param config
 */
BixolonPrint.prototype.printText = function (successCallback, errorCallback, config) {

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.printText success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.warn('BixolonPrint.printText failure: ' + error);
    };
  }

  var printConfig = this.settings,
    textLines = this.textLines;

  this.textLines = [];
  config = config || {};

  if (!this._isObject(config)) {
    throw new Error("BixolonPrint.printText failure: config parameter must be a object!");
  }

  if (config.lineFeed && parseInt(config.lineFeed) === config.lineFeed && config.lineFeed > 0) {
    printConfig.lineFeed = config.lineFeed;
  }

  if (config.formFeed === false || config.formFeed === true) {
    printConfig.formFeed = config.formFeed;
  }

  if (config.codePage && parseInt(config.codePage) >= 0) {
    printConfig.codePage = config.codePage;
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "printText", [textLines, printConfig]
  );
};

/**
 *
 * @param successCallback
 * @param errorCallback
 * @param config
 */
BixolonPrint.prototype.cutPaper = function (successCallback, errorCallback, config) {

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.cutPaper success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.warn('BixolonPrint.cutPaper failure: ' + error);
    };
  }

  var printConfig = this.settings;

  config = config || {};

  if (!this._isObject(config)) {
    throw new Error("BixolonPrint.cutPaper failure: config parameter must be a object!");
  }

  if (config.lineFeed && parseInt(config.lineFeed) === config.lineFeed && config.lineFeed > 0) {
    printConfig.lineFeed = config.lineFeed;
  }

  if (config.formFeed === false || config.formFeed === true) {
    printConfig.formFeed = config.formFeed;
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "cutPaper", [printConfig]
  );
};

/**
 *
 * @param successCallback
 * @param errorCallback
 * @param printStatus
 */
BixolonPrint.prototype.getStatus = function (successCallback, errorCallback, printStatus) {

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.getStatus success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.error('BixolonPrint.getStatus failure: ' + error);
    };
  }

  if (!printStatus) printStatus = false;

  if (!(printStatus === true || printStatus === false)) {
    throw new Error("BixolonPrint.getStatus failure: printStatus parameter must be a bool!");
  }

  var printConfig = this.settings;

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "getStatus", [printStatus, printConfig]
  );
};

BixolonPrint.prototype.startMsrReaderListener = function (successCallback, errorCallback) {

  bixolonPrint.msrReaderReadCallback = successCallback;

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.startMsrReaderListener success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.error('BixolonPrint.startMsrReaderListener failure: ' + error);
    };
  }

  exec(
    bixolonPrint.msrReaderRead,
    errorCallback,
    "BixolonPrint",
    "startMsrReaderListener", []
  );
};

BixolonPrint.prototype.msrReaderRead = function (data) {
  bixolonPrint.msrReaderReadCallback(data);
};

BixolonPrint.prototype.stopMsrReaderListener = function (successCallback, errorCallback) {

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.stopMsrReaderListener success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.error('BixolonPrint.stopMsrReaderListener failure: ' + error);
    };
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "stopMsrReaderListener", []
  );
};

BixolonPrint.prototype.startConnectionListener = function (successCallback, errorCallback) {

  bixolonPrint.connectionCallback = successCallback;

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.startConnectionListener success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.error('BixolonPrint.startConnectionListener failure: ' + error);
    };
  }

  exec(
    bixolonPrint.connectionChanged,
    errorCallback,
    "BixolonPrint",
    "startConnectionListener", []
  );
};

BixolonPrint.prototype.connectionChanged = function (data) {
  bixolonPrint.connectionCallback(data);
};

BixolonPrint.prototype.stopConnectionListener = function (successCallback, errorCallback) {

  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.stopConnectionListener success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.error('BixolonPrint.stopConnectionListener failure: ' + error);
    };
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "stopConnectionListener", []
  );
};

BixolonPrint.prototype.reconnect = function (successCallback, errorCallback) {
  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.reconnect success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.error('BixolonPrint.reconnect failure: ' + error);
    };
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "reconnect", []
  );
};

BixolonPrint.prototype.disconnect = function (successCallback, errorCallback) {
  if (!this._isFunction(successCallback)) {
    successCallback = function (response) {
      console.log('BixolonPrint.disconnect success: ' + response);
    };
  }

  if (!this._isFunction(errorCallback)) {
    errorCallback = function (error) {
      console.error('BixolonPrint.disconnect failure: ' + error);
    };
  }

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "disconnect", []
  );
};

/**
 * for image printing
 */

BixolonPrint.prototype._isObject = function (obj) {
  return typeof obj === 'object' && !!obj;
};
BixolonPrint.prototype._isFunction = function (obj) {
  return typeof obj === 'function';
};
BixolonPrint.prototype._isUndefined = function (obj) {
  return typeof obj === 'undefined' || obj === null;
};
BixolonPrint.prototype.printBitmap = function (successCallback, errorCallback, config) {
  var base64Image = config.base64Image;

  var width = !this._isUndefined(config.width) ? config.width : 100;
  var brightness = !this._isUndefined(config.brightness) ? config.brightness : 50;
  var alignment = !this._isUndefined(config.alignment) ? config.alignment : this.ALIGNMENT.CENTER;

  exec(
    successCallback,
    errorCallback,
    "BixolonPrint",
    "printBitmap",
    [base64Image, width, brightness, alignment]
  );
};

var bixolonPrint = new BixolonPrint();

/**
 *
 * @type {BixolonPrint}
 */
module.exports = bixolonPrint;
