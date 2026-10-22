// React and ReactDOM are loaded by the <script> tags in index.html.

/* ---------- Home: companies and the students who interviewed there ---------- */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { experiences: [], search: '' };
  }

  // runs once, right after the component appears on the screen
  componentDidMount() {
    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => this.setState({ experiences: data }));
  }

  render() {
    // keep only the experiences whose company name contains the search text
    const search = this.state.search.toLowerCase();
    const experiences = this.state.experiences.filter((exp) =>
      exp.company.toLowerCase().includes(search)
    );

    // list of company names, without repeats
    const companies = [];
    experiences.forEach((exp) => {
      if (!companies.includes(exp.company)) companies.push(exp.company);
    });

    return (
      <div>
        <p>
          Preparing for an interview? See who from our college has already
          attended it and what they were asked.
        </p>

        <input
          type="text"
          placeholder="Search by company"
          onChange={(event) => this.setState({ search: event.target.value })}
        />

        {companies.map((company) => (
          <div key={company}>
            <h3>{company}</h3>
            <ul>
              {experiences
                .filter((exp) => exp.company === company)
                .map((exp) => (
                  <li key={exp._id}>
                    {exp.studentName} - {exp.role}
                    <button onClick={() => this.props.onOpen(exp)}>View</button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

/* ---------- ExperienceDetail: one student's full write-up ---------- */
class ExperienceDetail extends React.Component {
  render() {
    const exp = this.props.experience;

    return (
      <div>
        <button onClick={this.props.onBack}>Back</button>

        <h2>
          {exp.company} - {exp.role}
        </h2>
        <p>
          {exp.studentName} ({exp.branch}, {exp.batch})
        </p>
        <p>
          Date: {exp.interviewDate ? exp.interviewDate.slice(0, 10) : 'not given'} | Difficulty: {exp.difficulty} |
          Result: {exp.outcome}
        </p>

        <h3>Rounds</h3>
        <p className="text">{exp.rounds}</p>

        <h3>Questions asked</h3>
        <p className="text">{exp.questions}</p>

        <h3>Tips</h3>
        <p className="text">{exp.tips}</p>
      </div>
    );
  }
}

/* ---------- ShareForm: the questions a student answers ---------- */
class ShareForm extends React.Component {
  constructor(props) {
    super(props);
    // one state value for every question in the form
    this.state = {
      studentName: '',
      branch: '',
      batch: '',
      company: '',
      role: '',
      interviewDate: '',
      difficulty: 'Easy',
      outcome: 'Selected',
      rounds: '',
      questions: '',
      tips: ''
    };
    // so that "this" works inside these methods
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // runs on every keystroke: stores the typed value in state, using the input's name
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // send the state (all the answers) to the server, then go back home
  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    }).then(() => this.props.onDone());
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Share your interview experience</h2>

        <label>Your name</label>
        <input type="text" name="studentName" onChange={this.handleChange} required />

        <label>Branch</label>
        <input type="text" name="branch" onChange={this.handleChange} required />

        <label>Graduation year</label>
        <input type="text" name="batch" onChange={this.handleChange} required />

        <label>Company</label>
        <input type="text" name="company" onChange={this.handleChange} required />

        <label>Role you applied for</label>
        <input type="text" name="role" onChange={this.handleChange} required />

        <label>Interview date</label>
        <input type="date" name="interviewDate" onChange={this.handleChange} required />

        <label>How difficult was it?</label>
        <select name="difficulty" onChange={this.handleChange}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Result</label>
        <select name="outcome" onChange={this.handleChange}>
          <option>Selected</option>
          <option>Not selected</option>
          <option>Result awaited</option>
        </select>

        <label>What were the rounds?</label>
        <textarea name="rounds" rows="4" onChange={this.handleChange} required />

        <label>What questions were asked?</label>
        <textarea name="questions" rows="4" onChange={this.handleChange} required />

        <label>Any tips for others?</label>
        <textarea name="tips" rows="4" onChange={this.handleChange} />

        <button type="submit">Publish</button>
      </form>
    );
  }
}

/* ---------- App: decides which page to show ---------- */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 'home', selected: null };
  }

  render() {
    const page = this.state.page;

    return (
      <div className="container">
        <h1>Interview Experiences</h1>
        <button onClick={() => this.setState({ page: 'home' })}>Home</button>
        <button onClick={() => this.setState({ page: 'form' })}>
          Share your experience
        </button>
        <hr />

        {page === 'home' && (
          <Home onOpen={(exp) => this.setState({ page: 'detail', selected: exp })} />
        )}

        {page === 'form' && (
          <ShareForm onDone={() => this.setState({ page: 'home' })} />
        )}

        {page === 'detail' && (
          <ExperienceDetail
            experience={this.state.selected}
            onBack={() => this.setState({ page: 'home' })}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));