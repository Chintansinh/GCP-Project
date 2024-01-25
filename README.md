# Project Report on

“ **Web-based Chat Application for Corporations** ”

# Abstract

This report presents the design, development, and deployment of a sophisticated web-based chat application tailored specifically for corporate environments. In response to the pressing demand for streamlined and secure communication tools within organizations, this project aimed to create an intuitive and robust platform that facilitates efficient real-time interactions among employees.

The chat application consists of two integral parts: an administration portal for user and team management, and a chat interface enabling seamless message exchange. Leveraging Google Cloud Platform's suite of services, the project integrates Load Balancing, Cloud Storage, Cloud Functions, IAM, BigQuery, Cloud SQL, Cloud Run, Compute Engine, Artifact Registry, and VPC network to deliver a comprehensive solution.

Key features encompass user authentication, and message delivery via MQTT protocol and MQTT Broker(Mosquitto) hosted on Cloud Run and Compute Engine respectively, database management through Cloud SQL, and data visualization using BigQuery. The project emphasizes scalable architecture, implicit data security, and user experience while addressing the intricacies of corporate communication needs.

This report details the methodology, technological choices, and implementation strategies, and discusses potential enhancements, underscoring the significance of this web-based chat application in enhancing communication efficiency within corporate settings.

# Introduction

Our project focuses on developing a web-based chat application tailored for enterprise usage, emphasizing the demonstration of building a distributed application using cloud technologies.

This topic was chosen to address crucial enterprise communication needs, including customization, integration of existing systems, facilitating team collaboration, and adapting to the remote work landscape. Additionally, it aims to highlight the intrinsic benefits of cloud technology, particularly in ensuring robust data security and privacy measures and seamless scalability to meet evolving business demands.

Our project involved building a sophisticated web-based application consisting of two essential components: an administrative portal and a user interface dedicated to real-time chat functionality. The application's functionalities encompassed multiple aspects such as efficient user and team management, authentication mechanisms, real-time messaging features, and intuitive data visualization tools.

We adopted MQTT as the foundational framework and integrated open-source projects like MQTT.Cool and Mosquitto as the MQTT Broker. The entire development process adhered to cloud-native principles, ensuring scalability, flexibility, and resilience within the cloud infrastructure.

In summary, our project serves as an illustrative blueprint for constructing distributed systems on the Google Cloud Platform (GCP). It underscores the manifold advantages offered by cloud technology, specifically its ability to fortify data security, enable seamless scalability, enhance flexibility, and provide a cost-effective solution catering to the diverse communication needs of modern enterprises.

# Solution

## Messaging Model

Our messaging model is a classic “publisher/subscriber” model, which is typically used in distributed systems to facilitate communication between different components or services. It involves a messaging mechanism where senders of messages (publishers) don’t specifically direct messages to specific receivers (subscribers). Instead, they publish messages to specific topics or channels without knowledge of who the subscribers are.

In our scenario, publishers and subscribers represent individuals from distinct divisions like Finance or IT, each having their designated topic. For instance, a DevOps engineer within the IT department can publish messages under the 'IT' topic, allowing fellow department members to subscribe. Whenever a message gets published on a specific topic, all subscribers associated with that topic promptly receive the message in real-time. This functionality is illustrated in Figure 1.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/a48c4da0-28b5-4b57-bafa-8fc1a96ccf88)


*Figure 1: Messaging Model*

## Why We Chose MQTT over Pub/Sub

We opted against using pub-sub due to the absence of a JavaScript client-side library capable of both posting messages to pub-sub via its API and actively listening to specific channels with an associated handler for incoming messages. While we located support for the publisher code, we couldn't find a suitable solution for a vanilla JS client-side application to act as a subscriber with an active listening event. Therefore, we decided to go with MQTT, a more mature environment that aligns with our specific use case and offers the necessary support.

# Overall Design

Our application is a distributed architecture. To understand it simply through a 3-layer architecture, it encompasses the views, services, and a data layer, depicted in Figure 2. Notably, it adheres to a frontend-backend isolation model, segregating the UI and backend services into distinct deployments. The front ends - Admin Portal and Chat UI, exist as separate web pages securely hosted within Cloud Storage. On the backend, there is an API service and messaging middleware, managing the core functionalities of our application.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/b2c4b8df-1d15-404a-a44e-6cc526d4af85)


*Figure 2: 3-layer Architecture*

To showcase the benefits of cloud technologies, we've executed the entire backend services—excluding the MQTT-associated services—using various cloud services within GCP. A comprehensive depiction of this cloud-based deployment is outlined in Figure 3, highlighting the diverse range of services employed to support our application's functionalities.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/44b44550-3092-4745-9185-8cf985cf00b0)


*Figure 3: Architecture*

**Load Balancer**: Directs incoming internet traffic to the bucket housing our static web pages.

**IAM**: Manages permissions, enabling public access to the aforementioned buckets and the Apps.

**Bucket**: Serves as storage for the application's static web pages.

**Cloud Function**: Retrieves requests from the websites, supporting CRUD operations, and authentication for the chat app.

**VPC Serverless Connector**: Establishes secure connections between applications, such as linking Cloud Function to Cloud SQL.

**Cloud SQL**: Houses application data, including storage for chat logs.

**Cloud Run**: Hosts and manages the containerized image (MQTT Cool) on the cloud server.

**Artifact Registry**: Stores and manages Docker images essential for the server setup.

**Compute Engine**: Deploys and configures a dedicated VM to manage the Mosquitto MQTT broker.

**Datastream**: Serverless and easy-to-use change data capture and replication service used to access streaming, low-latency data from MySQL. This allows for near real-time analytics in BigQuery with Datastream for BigQuery.

**BigQuery**: Intended for extracting data from Cloud SQL through the use of Datastream for BigQuery for future analytics or dashboard creation, enhancing data visualization and analysis capabilities.

# Module Implementation

## Messaging

Our messaging model relies on the MQTT protocol. Users engage in message transmission and reception via an HTML page (Chat UI), establishing a connection to an MQTT gateway (MQTT.Cool). All communication with the MQTT broker is channeled through this gateway, as depicted in Figure 4.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/b7d9dfa1-57ea-45ff-b005-a5b99308cf69)


*Figure 4: Messaging*

MQTT. Cool is hosted on Cloud Run due to its containerized nature, ensuring efficient deployment. Meanwhile, we opted for Compute Engine to host Mosquitto, our MQTT broker. This choice was deliberate as a virtual machine offers additional functionalities such as port exposure, firewall rule management, robust computational capabilities, and scalability options when required.

The workflow for publishing docker images and interaction is illustrated in Figure 5.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/1b96862b-b339-4ce2-8ead-a0aa80c4c161)


*Figure 5: MQTT.Cool and Mosquitto*

## Authentication and Management

Before users can send or receive messages, they're required to authenticate their identities. This authentication process is managed through Cloud Function. When a user attempts to log in, an HTTP request is directed to a Cloud Function instance. Subsequently, the Cloud Function sends a query to the MySQL database, hosted on Cloud SQL, facilitated by a VPC serverless connector. If the user information aligns with the database records, the authentication is granted.

Additionally, administrators possess the capability to oversee, add, or delete teams and users. These administrative tasks operate through Cloud Function, following a similar request process as the authentication mechanism. The sequence of this process is detailed in Figure 6.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/849823f0-8d5b-4b05-aede-39e81a5bb02c)

*Figure 6: Authentication and Management*

## User Interface

We've developed two distinct user interfaces: the Admin Portal, dedicated to administrative functions such as user and team management, and the Chat UI, facilitating regular user messaging. Figure 7 illustrates this setup.

The Admin Portal interacts with CRUD services (Cloud Function), managing data requests and exchanges. Conversely, the Chat UI is responsible for message transmission and reception, connecting with the message gateway (MQTT.Cool) to facilitate seamless communication between users.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/966770ba-541c-4c30-a2c0-19b7fe05f285)

![test](https://github.com/Chintansinh/GCP-Project/assets/29005941/47e19aec-6664-4261-9e72-cba7ff8dcc06)



*Figure 7: Admin Portal (left) and Chat UI (right)*

Both interfaces are static pages securely stored within dedicated buckets. To regulate access, we employ load balancers to efficiently manage incoming traffic. IAM plays a crucial role by meticulously assigning permissions to these load balancers, guaranteeing controlled and secure access to our interfaces. Refer to Figure 8 for visualization.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/10b16e68-7958-49ad-b1bc-07846d28008a)


*Figure 8: User Interface*

## Data Visualization and Analysis

We use Google BigQuery as our data visualization tool. It allows us to create interactive and customizable reports and dashboards by transforming raw data into easy-to-understand visualizations like charts, graphs, and tables, as shown in Figure 9.

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/e6074c44-303f-457c-8ea3-fd812dce9763)


*Figure 9: Data Visualization and Analysis*

## Workflow for publishing static websites

![image](https://github.com/Chintansinh/GCP-Project/assets/29005941/03105344-01b5-47bb-aedc-4979e654b91b)


# Future work/Recommendations

Our application demonstrates solid functionality, yet there's potential for considerable improvements by leveraging cloud technologies more effectively.

Potential Enhancements:

**Rich Media Support via Cloud Storage**: We consider incorporating support for diverse media formats like images, audio, and video into our messaging features. This would leverage Cloud Storage's capacity for handling various data types efficiently, including unstructured data. Implementing features like lifecycle policies and access controls can enhance data management flexibility.

**Migration to App Engine for Scalability**: A transition from Cloud Function to App Engine could offer enhanced scalability. App Engine's managed infrastructure enables seamless auto-scaling, potentially supporting varying workloads more efficiently and simplifying operational aspects.

**Migration from Cloud SQL to Cloud Spanner**: It could significantly elevate our application's scalability and global accessibility. Cloud Spanner offers a globally distributed database with strong consistency and horizontal scaling, ensuring high availability and performance across regions. This transition would enhance our application's capability to handle large-scale data needs while providing seamless access to users across different geographic locations

**Implementation of Stackdriver for Monitoring and Logging**: Considering Stackdriver for system monitoring and logging could enhance our application's stability. Stackdriver's monitoring features, including performance insights and log analysis, offer valuable visibility into system health and performance, aiding in issue detection and resolution.

**Integration of IAM for Enhanced Security**: Exploring the integration of IAM into our application architecture could bolster security measures. IAM allows nuanced control over user permissions and data access, potentially strengthening overall security protocols.

By exploring these enhancements, our application aims to address existing limitations while aligning more closely with evolving user needs and industry standards.

# Conclusions

Our endeavor in crafting a corporate-tailored web-based chat application underscores the invaluable role of cloud technology in fostering efficient communication within organizations. Through the amalgamation of various Google Cloud Platform services, we've showcased the efficacy of a cloud-native approach in meeting intricate corporate communication needs.

This project serves as a testament to the manifold advantages offered by cloud technology. By leveraging Google Cloud Platform services, we've showcased its prowess in ensuring scalability, robust data security, and streamlined interactions. The integration of Load Balancing, Cloud Storage, Cloud Functions, IAM, BigQuery, Cloud SQL, Cloud Run, Compute Engine, and Artifact Registry highlights the flexibility and resilience inherent in cloud solutions.

Future enhancements for our application revolve around enriching media support, enhancing scalability via platform migration, fortifying monitoring and logging capabilities, and strengthening security measures. These improvements aim to further elevate user experience and align the application with evolving industry standards.

Our aim moving forward is to refine the application by incorporating richer media formats, improving scalability, enhancing monitoring capabilities, and fortifying security measures through deeper integration of access management protocols. These advancements are geared towards adapting the application to meet the evolving demands of modern enterprise communication.

# References

MQTT: <https://mqtt.org/>

MQTT.Cool: <https://mqtt.cool/>

Mosquitto: <https://mosquitto.org/>

Chat UI: <https://github.com/MQTTCool/chat-example>

Connecting cloud function with Cloud SQL: <https://www.youtube.com/watch?v=wvcGQZPWzrA>

MQTT server with Google Cloud engine: <https://www.youtube.com/watch?v=kcbkmpUbtD4>

# Appendices

Demo: <https://clipchamp.com/watch/S248vFkASux>

Admin Portal: <http://34.36.23.213/>

Chat UI: <http://34.160.196.90/>

Github: <https://github.com/Mahipal98/GCP-Project>
