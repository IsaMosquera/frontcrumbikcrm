/*********************************************************/
/*                 ejemplo13.js                          */
/*********************************************************/
/*
  Autor  : Edgar Gonzalez
  Web    : http://egonzale.org
  Email  : egonzale@ucla.edu.ve
  Rails  : version 4.2.1
  Fecha  : 12 de mayo del 2015
  basado en: http://extjstutorial.info/extjs-4-tutorial-extjs-tree-with-php-dan-mysql/86
             http://www.sencha.com/forum/showthread.php?4595-Creating-Ext.tree.TreePanel-from-static-JSON-data-in-one-shot
*/
	Ext.require([
	         	'Ext.tree.*',
	         	'Ext.data.*',
	         	'Ext.tip.*'
	         ]);

	         Ext.onReady(function() {
	         	Ext.QuickTips.init();
	         	
	         	var store = Ext.create('Ext.data.TreeStore', {
	         		proxy: {
	         			type: 'ajax',
	         			method: 'GET',
	         			url: 'http://127.0.0.1:3000/loadtree',

	         			
	         		},
	         		root: {
	         			text: 'Menu',
	         			id: 'root_node',
	         			expanded: true
	         		
	         		},
	         		folderSort: false,
	         		sorters: [{
	         			property: 'id',
	         			direction: 'ASC'
	         		}]
	         	});
              //CREACION DEL PANEL PARA RENDER
	         	var tree = Ext.create('Ext.tree.Panel', {
	         		store: store,
	         		renderTo: 'tree_el',
	         		height: 700,
	         		width: 250,
	         		reserveScrollbar: true,
        			loadMask: true,
       			     useArrows: true,
	         		title: 'Opciones',
	         		useArrows: true,
	                       isteners: {
	                         itemclick: function(view, node)
	                          {
	                         if(node.isLeaf()) 
	                         {
	                         		alert('Toque');

	                         } else if(node.isExpanded()) {
	                            node.collapse();
	                           } else {
	                              node.expand();
	                             }
	                        }
	         	       	
	                  }
	         	});
	         });