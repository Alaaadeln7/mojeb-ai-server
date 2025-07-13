import speech from "@google-cloud/speech";
import { config } from "dotenv";
config();

const speechClient = new speech.SpeechClient({
  credentials: {
    type: "service_account",
    project_id: "mujib-ai",
    private_key_id: "1d6f92b89816e563f9104885b4529cb6e5b2eed5",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvsOJs6uJv7p2z\nR8M6kUveqAZz/hhcr74qNyscQy/GkIeIGqWlSeoOi8JMGkAakehP3W8pYBdBItkJ\nRObSzzqPODPAqblUpGNVtGPoZFn6o64vnQyQTb96TN5kYcTNLlVu/DUCNq68kIwP\nQLy9MYPn2nMzVT5lwvpsllXdNYUSckXXDf3P2QOB1u0d2/cKe8dAf18z2Myrpm+x\nTnV02oduY2UhlZAjLa9FVIBL4agXyyeij7pK8XCYAnHESBnCwsKNkl5si0yIIkKO\nLTbc7bM+E1kjf9+5lZGfsycdNZh3j/ZdFTindzPTjQyvt9P4klTcEibD9/SvTWqO\n36TAjK2JAgMBAAECggEAE7pEDHiZ7TlhEA/VbELDHwjlM5pTJDowG1enQbTKHSze\nqRHb6nnInDJFgovaiZk7WZdqy12wssXN0sh/tiligREtn3s3Vhmg1U9sffxhrZ76\nOLq03dG7F8mgmaswQN1MZspPTfSzrXT6Ix7Q6poQHoVFFP0kBONuQOnnEZAYRYQr\naLWYCgHF/7yJwWKOkh3Y9PATZSkAxqGJweXa88XxISwSPoowBkFmu3JmCodpXhM8\n9O5bBAZoe2OC2Z+TK/uUAEkqC2inHMQEhjBIVCG45ESvzGbTT6TdWyCOrbr4k8bF\nT6/WR421Wkk1LnLI+dYlw3g8XmALu70eoJ5B7wYBIQKBgQDcyObGX/0Hhyua0jt2\nKf4iBABW0KK/tTwq+3xVQ1H9ZocpTPNjtKVoBXSaAIUYhrdVvzQGqzmpiMI2tsIl\nojcxF94O5YbzgAs/Y/w0sUG8S1WN+t+woOZ3KkvcQAAhKULTae/1PUWc+3Z2X436\nPekMY1BeukndhUsCf0ienCxoKQKBgQDLtrWT1sBJ3nawB6G9bHIKh2FlGQ0ZSS6b\nTLNorIwRtnMV9Kq2NhmnNEkiK9ho0DxOvHD/gT8N9cgzHdLySSSIAa0vXibVvY58\nWrtOqdz4qFGOrUNvsb6obI/JucSOM2TPneWdmzgRQRoojULM6PAd1KdUr5Ytv7up\nRFY3dQ5GYQKBgE+EvDlukP+JG5djaK8iaLlvn3+lHTjW2ZjRgvJikMEnkD67zF14\nzqosbNaaoVU4EAf+GYrdWKNK8kgqgrpzNlWkNwI+gOBqmaJ3LHr97KMYrvO4C6De\nEqOQxEnLc0B+T+c9HIPDUbM8jmoL+GLMsYcYrfWwOrJiM6XumgUmUoghAoGBAMWp\nZQor56xFRViMLy3DWexJbAFSi1krnyNlCvfX5JkTNRvqqPHgEIgivYuAi5034Cxt\nwB7K48nB4B1pJNOekOm+5rH9YyUlpmmXCAPN4fEMMQaFq9dm2h5GKEaOD+ACkiC5\njqCciYyEZMNQPa7hnorzWeFb9hYx4f7dpeJtnApBAoGAEiUWsOK36IGYI1KR32N3\nCotF/nGJ9lpCICox8xrkwG5UgvMndO3kvTUgMU2EzMjSnIh/uysWaE2IS5R3W5gQ\nFSfPGzMHyxqaUMHeqK82Qs07UlAGwLMYFlNX7E2m93FksKPMJbtOW99+bHcmeMZz\n4UlrD/wHHD97OpTeM+hz3do=\n-----END PRIVATE KEY-----\n",
    client_email: "op-demo@mujib-ai.iam.gserviceaccount.com",
    client_id: "108203808526788365034",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/op-demo%40mujib-ai.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
});

export default speechClient;
