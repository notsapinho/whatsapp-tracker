@echo off
echo --------------------
echo REMOTE DEBUG Server
echo --------------------
echo open chrome and navigate to:
echo chrome://inspect
echo --------------------
echo chrome will try to detect the remote process, this will take ~10sec !!!
echo Then a new Remote Target will show up
echo Click the blue "inspect" text
echo !!! Change the context in the remote console, from "VM Context 1" to "node[8812]"
echo --------------------
echo Exit with ctrl + d
echo --------------------
ssh -i id_rsa -L 9222:localhost:9229 root@server > nul 2>&1
@echo on
