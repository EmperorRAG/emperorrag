find /path/to/root -type f | awk -F/ '{
    dir = ""; for (i=1; i<NF; i++) dir = dir $i "/";
    files[dir] = files[dir] $NF "\n";
}
END {
    for (d in files) {
        print "Directory: " d;
        print files[d];
    }
}'
