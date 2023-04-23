import { createServer, Model } from 'miragejs';

/**The mirageJs library allows us to mock our server responses. By declaring
 * our endpoints, we can interecept the requests and handle them here. Once
 * the actuall endpoints become available, this becomes redundant.
 */
export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      quiz: Model,
      question: Model
    },

    seeds(server) {
      /**An initial state with two mocked quizzes and some questions. */
      const quizzes = [
        {
          name: 'Enterwell Quiz',
          questions: [
            {
              id: 1,
              question: "Who was the English mathematician and writer widely considered as the world's first computer programmer for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine?",
              answer: "Ada Lovelace"
            },
            {
              id: 2,
              question: "What is the smallest continent by land area?",
              answer: "Australia"
            },
            {
              id: 3,
              question: "What is the currency of Japan?",
              answer: "Yen"
            },
            {
              id: 4,
              question: "Who was the first man to walk on the moon?",
              answer: "Neil Armstrong"
            }
          ]
        },
        {
          name: 'Geography Quiz',
          questions: [
            {
              id: 5,
              question: "What is the smallest country in the world by land area?",
              answer: "Vatican City"
            },
            {
              id: 6,
              question: "Who invented the telephone?",
              answer: "Alexander Graham Bell"
            },
            {
              id: 7,
              question: "What is the largest country in the world by land area?",
              answer: "Russia"
            },
          ]
        },
      ];

      quizzes.forEach((quiz) => {
        const { questions } = quiz;

        server.create('quiz', quiz);

        questions.forEach((question) => {
          server.create('question', question);
        });
      });
    },

    routes() {

      this.namespace = '/api';

      /**A function to go through the questions array on each put and post request
       * for our quizzes. With this functionality, we differentiate the new questions
       * from the old ones, and them assign them an id, and store them in the questions array.
       */
      const handleNewQuestions = (schema, questions) => {

        let newQuestions = [];
        let questionIndex = schema.questions.all().length;

        let quizQuestions = questions
          .map((question) => {
            if (!question.id) {
              let newQuestion =
              {
                ...question,
                id: questionIndex
              }
              questionIndex += 1;
              newQuestions.push(newQuestion)
              return newQuestion
            }
            return question
          });

        newQuestions
          .forEach((question) => {
            schema.questions
              .create(question)
          });

        return quizQuestions;
      }

      this.get('/quizzes', (schema) => {
        return schema.quizzes.all().models;
      });

      this.get('/quizzes/:id', (schema, request) => {
        const id = request.params.id;
        return schema.quizzes.find(id).attrs;
      });

      this.post('/quizzes', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        const { questions, ...rest } = attrs;
        const quizQuestions = handleNewQuestions(schema, questions);
        const quiz = schema.quizzes.create({ ...rest, questions: quizQuestions });
        return quiz;
      });

      this.put('/quizzes/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);

        const { questions, ...rest } = attrs;
        const quizQuestions = handleNewQuestions(schema, questions);

        const quiz = schema.quizzes.find(id);
        quiz.update({ ...rest, questions: quizQuestions });

        return quiz.attrs;
      });

      this.get('/questions', (schema) => {
        return schema.questions.all().models;
      });

      this.del('/quizzes/:id', (schema, request) => {
        const id = request.params.id;
        schema.quizzes.find(id).destroy();
        return { success: true };
      });

    },

  });

  return server;
}
