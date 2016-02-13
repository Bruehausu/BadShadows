import java.util.*;

PShape s;
XML xml;
XML[] children;

void setup() {
  size(200, 200);
  // The file "bot.svg" must be in the data folder
  // of the current sketch to load successfully
  s = loadShape("1.svg");
  
  xml = loadXML("1.xml");
  
  //println("name: " + Arrays.toString(child1.listChildren()));
  //children = child1.getChildren("path");
  //println("number of paths: " + children.length);

  /*for (int i = 0; i < children.length; i++) {
    int id = children[i].getInt("id");
    String dString = children[i].getString("d");
    //String name = children[i].getContent();
    println(id + ", " + dString);
  }*/
  
  String svgdir = "svg/";
  String[] files = loadStrings(svgdir + "filelist.txt");
  
  Table table = new Table();
  table.addColumn("id");
  table.addColumn("file");
  table.addColumn("length");
  table.addColumn("xDiff");
  table.addColumn("yDiff");
  table.addColumn("coords");

  
  for(int i = 0; i < files.length; i++){
    if(i % 10 == 0){
      println("parsing " + files[i]);
    }
    xml = loadXML(svgdir + files[i]);
    children = xml.getChild("g").getChild("g").getChildren("path");
    for(int j = 0; j < children.length; j++){
      String dString = children[j].getString("d");
      
      if(dString.indexOf(',') >= 0){
        dString = dString.replace(',', ' ');
        StringBuilder sb = new StringBuilder(dString);
        for (int k = dString.length() - 1; k > 2; k--){
          if(dString.charAt(k) == 'M' || dString.charAt(k) == 'L' || 
             dString.charAt(k) == 'C'){
            sb.insert(k, " ");
          }
        }
        dString = sb.toString();
        // println(dString);
        
      } else {
        dString = dString.substring(0, dString.length() - 1);
      }
      
      String[] parts = dString.split(" ");
      
      double len = 0;
      double startX = Double.parseDouble(parts[0].substring(1,parts[0].length()));
      double startY = Double.parseDouble(parts[1]);
      double endX;
      if (Character.isAlphabetic(parts[parts.length - 2].charAt(0))){
        endX = Double.parseDouble(parts[parts.length - 2].substring(1,parts[parts.length - 2].length())); 
      } else {
        endX = Double.parseDouble(parts[parts.length - 2]);
      }
      double endY = Double.parseDouble(parts[parts.length - 1]);
      
      double diffX = endX - startX;
      double diffY = endY - startY;
      
      double prevX = startX;
      double prevY = startY;
      
      int k = 0;
      String coords = "";
      while(k < parts.length){
        double currX;
        double currY;
        switch (parts[k].charAt(0)){
          case 'M':
          case 'L':
            coords = coords + parts[k].substring(1,parts[k].length()) + " " + parts[k+1] + " ";
            currX = Double.parseDouble(parts[k].substring(1,parts[k].length()));
            currY = Double.parseDouble(parts[k + 1]);
            k += 2;
            break;
          case 'C':
            coords = coords + parts[k + 4] + " " + parts[k+5] + " ";
            currX = Double.parseDouble(parts[k+4]);
            currY = Double.parseDouble(parts[k+5]);
            k += 6;
            break;
          default:
            println("unrecognized instruction " + parts[k].charAt(0));
            throw new RuntimeException();
        }
        len = len + Math.sqrt(Math.pow(currX - prevX , 2) + Math.pow(currY - prevY , 2));
        prevX = currX;
        prevY = currY;
      }
      coords = coords.substring(0, coords.length()-1);
      TableRow newRow = table.addRow();
      newRow.setString("id", (i+1) + "-" + (j));
      newRow.setString("file", files[i]);
      newRow.setFloat("length", (float) len);
      newRow.setFloat("xDiff", (float) diffX);
      newRow.setFloat("yDiff", (float) diffY);
      newRow.setString("coords", coords);

    }
  }
  saveTable(table, "data/new.csv");
  
}

void draw() {
  shape(s, 10, 10, 80, 80);
}

