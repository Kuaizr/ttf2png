const opentype = require('opentype.js')
const fs = require('fs')
const path = require('path')
const { Resvg } = require('@resvg/resvg-js')
const svgpath = require("svgpath");


function svgHeader(font, glyph) {
    const height = font.ascender - font.descender;
    const copyright = fontToCopyright(font);
    let svg = `<svg xmlns="http://www.w3.org/2000/svg"
    width="100" height="100"
    viewBox="0 0 ${glyph.advanceWidth} ${height}">
  `;
    if (copyright != "") {
        svg += `  <!--
  ${copyright}
    -->
  `;
    }
    return svg;
}

function toSVG(font, glyphOfChar, noUpsideDown) {
    const d = svgpath(glyphOfChar.path.toPathData())
        .translate(0, noUpsideDown ? font.ascender : 0)
        .scale(1, noUpsideDown ? 1 : -1)
        .translate(0, noUpsideDown ? -font.ascender : font.ascender)
        .toString();
    if (d == "") return undefined;
    const path = `<path d="${d}"/>`;
    return svgHeader(font, glyphOfChar) + path + "\n</svg>";
}

function getInfo(hash) {
    if (!hash) return "";
    const arr = Object.values(hash);
    if (arr.length > 0) {
        return arr[0];
    } else {
        return "";
    }
}

function fontToCopyright(font) {
    const copyrights = font.names.copyright
        ? Object.values(font.names.copyright).join("\n")
        : "";
    const trademarks = font.names.trademark
        ? Object.values(font.names.trademark).join("\n")
        : "";
    const licenses = font.names.license
        ? Object.values(font.names.license).join("\n")
        : "";
    const licenseURLs = font.names.licenseURL
        ? Object.values(font.names.licenseURL).join("\n")
        : "";
    const infos = [copyrights, trademarks, licenses, licenseURLs];
    return infos.filter((info) => info).join("\n");
}

function svg2png(svg,exportPath,width,save) {
    const opts = {
      background: 'rgba(0, 0, 0, 0)',
      fitTo: {
        mode: 'width',
        value: width,
      }
    }
    const resvg = new Resvg(svg, opts)
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()
    if(save){
        fs.writeFileSync(path.join(__dirname, exportPath), pngBuffer)
    }
    return pngBuffer
}

function fromFile(fontPath,noUpsideDown,width,save = true) {
    //获取字体文件名称
    const fontname = fontPath.substr(fontPath.lastIndexOf("/")+1,fontPath.lastIndexOf(".")-fontPath.lastIndexOf("/")-1)
    //创建保存图片的文件夹
    if(fs.existsSync(path.join(__dirname,fontname)) == false && save){
        fs.mkdirSync(path.join(__dirname,fontname))
    }

    const pngData = []

    const font = opentype.loadSync(fontPath)

    for(let i = 0; i < font.glyphs.length; i++){
        let glyph = font.glyphs.glyphs[i]
        let glyphIndex = i
        let svg = toSVG(font,glyph,noUpsideDown)
        if(svg != undefined){
            let png = svg2png(svg,fontname+"/"+glyphIndex+".png",width ,save)
            pngData.push(png)
        }
    }

    return pngData
}

function fromChars(fontPath,noUpsideDown,width,chars,save = true) {
    //获取字体文件名称
    const fontname = fontPath.substr(fontPath.lastIndexOf("/")+1,fontPath.lastIndexOf(".")-fontPath.lastIndexOf("/")-1)
    //创建保存图片的文件夹
    if(fs.existsSync(path.join(__dirname,fontname)) == false && save){
        fs.mkdirSync(path.join(__dirname,fontname))
    }

    const pngData = []

    const font = opentype.loadSync(fontPath)

    for(let i = 0; i < chars.length; i++){
        let glyph = font.charToGlyph(chars[i])
        let glyphIndex = font.charToGlyphIndex(chars[i])
        let svg = toSVG(font,glyph,noUpsideDown)
        if(svg != undefined){
            let png = svg2png(svg,fontname+"/"+glyphIndex+".png",width, save)
            pngData.push(png)
        }
    }

    return pngData
}

module.exports = { fromFile, fromChars }