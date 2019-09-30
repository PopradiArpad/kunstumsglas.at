function check_prerequisites(db) {
  let mainview = db.mainviews.find().next();

  exit_when_not_empty(mainview.users);
  exit_when_not_empty(mainview.translations);
  exit_when_not_empty(mainview.productGroups);
}

function print_current_mainview() {
  let c = db.mainviews.find();

  query_result = c.next();
  printjson(query_result);
}

function link_to_mainview(collection_name, mainview_field) {
  let c = db[collection_name].find({}, {"id":1});

  while (c.hasNext()) {
     let qr = c.next();

     db.mainviews.update({}, {$push: {[mainview_field]: qr._id} } );
  }
}

function exit_when_not_empty(array) {
  if (array != 0) {
    throw new Error("MainView is already set!");
  }
}


let conn = new Mongo();
let db = conn.getDB("test");

// print_current_mainview();
check_prerequisites(db);
link_to_mainview("users", "users");
link_to_mainview("translations", "translations");
link_to_mainview("productgroups", "productGroups");
// print_current_mainview();
