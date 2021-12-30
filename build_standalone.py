

with open("index_aquariums.html","r") as aquariumHTML :
    print( "opened index aquarium")
    with open("scripts.js","r")  as scripts : 
        print("opened scripts")
        with open("index_aquarium_standalone.html", "w") as destination : 
            print ("opened destination")
            htmlString = aquariumHTML.read()
            scriptString = scripts.read()
            finalString = htmlString + "<script>\n"+ scriptString +"</script>\n"
            destination.write(finalString)
            print("build finished")

