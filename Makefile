all:
	hugo -d docs
	git commit -a -m "Updates"
	git push
