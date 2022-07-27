echo 'Getting the credentials for aws with docker'
docker login -u AWS -p $(aws ecr get-login-password --region ca-central-1) 761161982961.dkr.ecr.ca-central-1.amazonaws.com
echo 'Building the Docker image'
docker build -t loominate-1.0-frontend:latest .
echo 'Tagging the Docker image'
docker tag loominate-1.0-frontend:latest 761161982961.dkr.ecr.ca-central-1.amazonaws.com/loominate-1.0-frontend:latest
# echo 'Getting the credentials for aws with docker'
# aws ecs get-login-password --region us-east-2 | docker login --username AWS --password-stdin 938510084600.dkr.ecr.us-east-2.amazonaws.com
echo 'Pushing the Image to AWS'
docker push 761161982961.dkr.ecr.ca-central-1.amazonaws.com/loominate-1.0-frontend:latest
sleep 10
#aws ecs update-service --cluster CHANNEL-DEV-CLUSTER --service CHANNEL-DEV-SERVICE --force-new-deployment
chmod 400 trakinvest-key.pem
ssh -i "trakinvest-key.pem" ubuntu@ec2-35-183-41-26.ca-central-1.compute.amazonaws.com "docker stop frontend; docker rm frontend; docker rmi 761161982961.dkr.ecr.ca-central-1.amazonaws.com/loominate-1.0-frontend:latest; docker login -u AWS -p $(aws ecr get-login-password --region ca-central-1) 761161982961.dkr.ecr.ca-central-1.amazonaws.com;docker pull 761161982961.dkr.ecr.ca-central-1.amazonaws.com/loominate-1.0-frontend:latest; docker run -d --network='host' --restart always --name frontend -p 5000:3000 761161982961.dkr.ecr.ca-central-1.amazonaws.com/loominate-1.0-frontend:latest"
#echo "waiting for ecs update for 10 seconds..."
sleep 10
echo "deployment successful!"









