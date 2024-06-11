#/bin/bash

check_mysql_ready () {
  mysqladmin ping -h${DATABASE_HOST} > /dev/null 2>&1
}

wait_max=20
count=0
echo waiting for mysql
until check_mysql_ready
do
  printf "."
  sleep 1

  count=$((count + 1))
  if [ $count -ge $wait_max ]; then
    echo -e "\n**** ERROR mysql not ready ****"
    exit 1
  fi
done

echo -e "\nmysql ready"
