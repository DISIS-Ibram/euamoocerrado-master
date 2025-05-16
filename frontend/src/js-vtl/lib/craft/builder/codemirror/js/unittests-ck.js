/**
 * Test Harness for CodeMirror
 * JS-unit compatible tests here.  The two available assertions are
 * assertEquals (strict equality) and assertEquivalent (looser equivalency).
 *
 * 'editor' is a global object for the CodeMirror editor shared between all
 * tests.  After manipulating it in each test, try to restore it to
 * approximately its original state.
 */function testSetGet(){var e="It was the best of times.\nIt was the worst of times.";editor.setCode(e);assertEquals(e,editor.getCode());editor.setCode("");assertEquals("",editor.getCode())}function testSetStylesheet(){function e(){links=editor.win.document.getElementsByTagName("link");css=[];for(var e=0,t;t=links[e];e++)t.rel.indexOf("stylesheet")!==-1&&css.push([t.href.substring(t.href.lastIndexOf("/")+1),!t.disabled]);return css}assertEquivalent([],e());editor.setStylesheet("css/jscolors.css");assertEquivalent([["jscolors.css",!0]],e());editor.setStylesheet(["css/csscolors.css","css/xmlcolors.css"]);assertEquivalent([["jscolors.css",!1],["csscolors.css",!0],["xmlcolors.css",!0]],e());editor.setStylesheet([]);assertEquivalent([["jscolors.css",!1],["csscolors.css",!1],["xmlcolors.css",!1]],e())}var tests=["testSetGet","testSetStylesheet"];